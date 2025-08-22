import bcrypt from 'bcryptjs';
import pool from '../database.js';
import { generateToken } from '../middleware/auth.js';

export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    // Find user by email or username (case-insensitive)
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = $1 OR LOWER(username) = $1',
      [emailOrUsername.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check if user is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const remainingMinutes = Math.ceil((new Date(user.locked_until).getTime() - new Date().getTime()) / (1000 * 60));
      return res.status(423).json({ 
        message: `Account is temporarily locked. Please try again in ${remainingMinutes} minutes.` 
      });
    }

    // Check if user is suspended
    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account has been suspended' });
    }

    // Check if user is pending approval
    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Account is pending approval' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      // Increment failed login attempts
      const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
      const maxAttempts = 5;
      const lockoutDuration = 15; // minutes

      let lockedUntil = null;
      if (newFailedAttempts >= maxAttempts) {
        lockedUntil = new Date(Date.now() + lockoutDuration * 60 * 1000);
      }

      await pool.query(
        'UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3',
        [newFailedAttempts, lockedUntil, user.id]
      );

      if (newFailedAttempts >= maxAttempts) {
        return res.status(423).json({ 
          message: `Too many failed login attempts. Account locked for ${lockoutDuration} minutes.` 
        });
      }

      const remainingAttempts = maxAttempts - newFailedAttempts;
      return res.status(401).json({ 
        message: `Invalid password. ${remainingAttempts} attempts remaining before account lockout.` 
      });
    }

    // Reset failed login attempts and update last login
    await pool.query(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data (without password)
    const { password_hash, failed_login_attempts, locked_until, ...userData } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Email, username, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if email or username already exists (case-insensitive)
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE LOWER(email) = $1 OR LOWER(username) = $2',
      [email.toLowerCase(), username.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Email or username already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user (all new users are pending approval)
    const newUser = await pool.query(
      `INSERT INTO users (id, email, username, password_hash, role, status, is_email_verified) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, email, username, role, status, created_at`,
      [
        `user-${Date.now()}`,
        email.toLowerCase(),
        username.toLowerCase(),
        hashedPassword,
        'user',
        'pending',
        false
      ]
    );

    const user = newUser.rows[0];

    const message = 'Account created successfully! Please wait for admin approval.';

    res.status(201).json({
      message,
      user
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, username, role, status, language, created_at, last_login FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email, username, language } = req.body;
    const updates = {};
    const values = [];
    let paramCount = 1;

    if (email) {
      // Check if email is already taken (case-insensitive)
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE LOWER(email) = $1 AND id != $2',
        [email.toLowerCase(), req.user.id]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({ message: 'Email address is already in use' });
      }
      updates.email = email.toLowerCase();
    }

    if (username) {
      // Check if username is already taken (case-insensitive)
      const usernameCheck = await pool.query(
        'SELECT id FROM users WHERE LOWER(username) = $1 AND id != $2',
        [username.toLowerCase(), req.user.id]
      );
      if (usernameCheck.rows.length > 0) {
        return res.status(409).json({ message: 'Username is already taken' });
      }
      updates.username = username.toLowerCase();
    }

    if (language) {
      updates.language = language;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid updates provided' });
    }

    const setClause = Object.keys(updates)
      .map(key => `${key} = $${paramCount++}`)
      .join(', ');

    const query = `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING id, email, username, role, status, language, created_at, last_login`;

    const result = await pool.query(query, [...Object.values(updates), req.user.id]);

    res.json({ 
      message: 'Profile updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin endpoints
export const getPendingUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, username, role, status, created_at FROM users WHERE status = $1 ORDER BY created_at DESC',
      ['pending']
    );

    res.json({ pendingUsers: result.rows });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, username, status',
      ['active', userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'User approved successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 AND status = $2 RETURNING id',
      [userId, 'pending']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found or not pending' });
    }

    res.json({ message: 'User rejected and deleted successfully' });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
