import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string; // In a real app, this would be hashed
  role: 'user' | 'admin';
  status: 'active' | 'pending' | 'suspended';
  language: 'en' | 'es';
  createdAt: string;
  lastLogin?: string;
  isEmailVerified: boolean;
  failedLoginAttempts: number;
  lockedUntil?: string;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface SignupData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface AuthStore {
  // Current user state
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // All users (for admin)
  users: User[];
  
  // App settings
  allowSignups: boolean;
  requireApproval: boolean;
  
  // Security settings
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  
  // Authentication methods
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  signup: (data: SignupData) => Promise<{ success: boolean; message: string }>;
  changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  
  // User profile methods
  updateUserProfile: (userId: string, updates: { email?: string; username?: string }) => Promise<{ success: boolean; message: string }>;
  
  // Admin methods
  approveUser: (userId: string) => void;
  suspendUser: (userId: string) => void;
  activateUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  resetUserPassword: (userId: string, newPassword: string) => void;
  toggleSignups: () => void;
  toggleApproval: () => void;
  unlockUser: (userId: string) => void;
  
  // User preferences
  updateUserLanguage: (userId: string, language: 'en' | 'es') => void;
  
  // Utility methods
  getUserById: (userId: string) => User | undefined;
  isAdmin: () => boolean;
  isUserLocked: (user: User) => boolean;
}

// Create default admin user
const defaultAdmin: User = {
  id: 'admin-001',
  email: 'admin@vivisews.com',
  username: 'ADMIN',
  password: 'pineda0322', // In production, this would be hashed
  role: 'admin',
  status: 'active',
  language: 'en',
  createdAt: new Date().toISOString(),
  isEmailVerified: true,
  failedLoginAttempts: 0,
};

// Create some sample users
const sampleUsers: User[] = [
  {
    id: 'user-001',
    email: 'john@example.com',
    username: 'john_doe',
    password: 'password123',
    role: 'user',
    status: 'active',
    language: 'en',
    createdAt: new Date().toISOString(),
    isEmailVerified: true,
    failedLoginAttempts: 0,
  },
  {
    id: 'user-002',
    email: 'jane@example.com',
    username: 'jane_smith',
    password: 'password123',
    role: 'user',
    status: 'pending',
    language: 'es',
    createdAt: new Date().toISOString(),
    isEmailVerified: false,
    failedLoginAttempts: 0,
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      users: [defaultAdmin, ...sampleUsers],
      allowSignups: true,
      requireApproval: true,
      maxLoginAttempts: 5,
      lockoutDuration: 15, // 15 minutes
      
      login: async (credentials) => {
        set({ isLoading: true });
        
        try {
          const { users, maxLoginAttempts, lockoutDuration } = get();
          const user = users.find(u => 
            u.email.toLowerCase() === credentials.emailOrUsername.toLowerCase() || 
            u.username.toLowerCase() === credentials.emailOrUsername.toLowerCase()
          );
          
          if (!user) {
            set({ isLoading: false });
            return { success: false, message: 'Invalid email/username or password' };
          }
          
          // Check if user is locked out
          if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
            const remainingMinutes = Math.ceil((new Date(user.lockedUntil).getTime() - new Date().getTime()) / (1000 * 60));
            set({ isLoading: false });
            return { 
              success: false, 
              message: `Account is temporarily locked. Please try again in ${remainingMinutes} minutes.` 
            };
          }
          
          if (user.status === 'suspended') {
            set({ isLoading: false });
            return { success: false, message: 'Account has been suspended. Please contact admin.' };
          }
          
          if (user.status === 'pending') {
            set({ isLoading: false });
            return { success: false, message: 'Account is pending approval. Please wait for admin approval.' };
          }
          
          // Check password
          if (user.password !== credentials.password) {
            // Increment failed login attempts
            const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
            const updatedUsers = users.map(u => 
              u.id === user.id 
                ? { 
                    ...u, 
                    failedLoginAttempts: newFailedAttempts,
                    lockedUntil: newFailedAttempts >= maxLoginAttempts 
                      ? new Date(Date.now() + lockoutDuration * 60 * 1000).toISOString()
                      : undefined
                  }
                : u
            );
            
            set({ users: updatedUsers });
            set({ isLoading: false });
            
            if (newFailedAttempts >= maxLoginAttempts) {
              return { 
                success: false, 
                message: `Too many failed login attempts. Account locked for ${lockoutDuration} minutes.` 
              };
            }
            
            const remainingAttempts = maxLoginAttempts - newFailedAttempts;
            return { 
              success: false, 
              message: `Invalid password. ${remainingAttempts} attempts remaining before account lockout.` 
            };
          }
          
          // Successful login - reset failed attempts and update last login
          const updatedUsers = users.map(u => 
            u.id === user.id 
              ? { 
                  ...u, 
                  lastLogin: new Date().toISOString(),
                  failedLoginAttempts: 0,
                  lockedUntil: undefined
                }
              : u
          );
          
          set({
            currentUser: { 
              ...user, 
              lastLogin: new Date().toISOString(),
              failedLoginAttempts: 0,
              lockedUntil: undefined
            },
            isAuthenticated: true,
            isLoading: false,
            users: updatedUsers,
          });
          
          return { success: true, message: 'Login successful' };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, message: 'Login failed. Please try again.' };
        }
      },
      
      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
        });
      },
      
      signup: async (data) => {
        const { users, allowSignups, requireApproval } = get();
        
        if (!allowSignups) {
          return { success: false, message: 'Signups are currently disabled' };
        }
        
        // Validate input
        if (data.password !== data.confirmPassword) {
          return { success: false, message: 'Passwords do not match' };
        }
        
        if (data.password.length < 6) {
          return { success: false, message: 'Password must be at least 6 characters long' };
        }
        
        // Check if email or username already exists
        const existingUser = users.find(u => 
          u.email.toLowerCase() === data.email.toLowerCase() ||
          u.username.toLowerCase() === data.username.toLowerCase()
        );
        
        if (existingUser) {
          return { success: false, message: 'Email or username already exists' };
        }
        
        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          email: data.email.toLowerCase(),
          username: data.username,
          password: data.password, // In production, hash this
          role: 'user',
          status: requireApproval ? 'pending' : 'active',
          language: 'en', // Default to English
          createdAt: new Date().toISOString(),
          isEmailVerified: false,
          failedLoginAttempts: 0,
        };
        
        set({
          users: [...users, newUser],
        });
        
        const message = requireApproval 
          ? 'Account created successfully! Please wait for admin approval.'
          : 'Account created successfully! You can now log in.';
        
        return { success: true, message };
      },
      
      changePassword: async (userId, currentPassword, newPassword) => {
        const { users, currentUser } = get();
        
        if (!currentUser) {
          return { success: false, message: 'Not authenticated' };
        }
        
        // Only allow users to change their own password, or admins to change any password
        if (currentUser.id !== userId && currentUser.role !== 'admin') {
          return { success: false, message: 'Unauthorized' };
        }
        
        const user = users.find(u => u.id === userId);
        if (!user) {
          return { success: false, message: 'User not found' };
        }
        
        // Verify current password (unless admin)
        if (currentUser.role !== 'admin' && user.password !== currentPassword) {
          return { success: false, message: 'Current password is incorrect' };
        }
        
        if (newPassword.length < 6) {
          return { success: false, message: 'Password must be at least 6 characters long' };
        }
        
        const updatedUsers = users.map(u => 
          u.id === userId ? { ...u, password: newPassword } : u
        );
        
        set({ users: updatedUsers });
        
        // Update current user if they changed their own password
        if (currentUser.id === userId) {
          set({ currentUser: { ...currentUser, password: newPassword } });
        }
        
        return { success: true, message: 'Password changed successfully' };
      },
      
      updateUserProfile: async (userId, updates) => {
        const { users, currentUser } = get();
        
        if (!currentUser) {
          return { success: false, message: 'Not authenticated' };
        }
        
        // Only allow users to update their own profile, or admins to update any profile
        if (currentUser.id !== userId && currentUser.role !== 'admin') {
          return { success: false, message: 'Unauthorized' };
        }
        
        const user = users.find(u => u.id === userId);
        if (!user) {
          return { success: false, message: 'User not found' };
        }
        
        // Validate email format if provided
        if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
          return { success: false, message: 'Please enter a valid email address' };
        }
        
        // Check if email is already taken by another user
        if (updates.email && updates.email.toLowerCase() !== user.email.toLowerCase()) {
          const emailExists = users.some(u => 
            u.id !== userId && u.email.toLowerCase() === updates.email!.toLowerCase()
          );
          if (emailExists) {
            return { success: false, message: 'Email address is already in use' };
          }
        }
        
        // Check if username is already taken by another user
        if (updates.username && updates.username.toLowerCase() !== user.username.toLowerCase()) {
          const usernameExists = users.some(u => 
            u.id !== userId && u.username.toLowerCase() === updates.username!.toLowerCase()
          );
          if (usernameExists) {
            return { success: false, message: 'Username is already taken' };
          }
        }
        
        // Validate username length
        if (updates.username && updates.username.length < 3) {
          return { success: false, message: 'Username must be at least 3 characters long' };
        }
        
        const updatedUsers = users.map(u => 
          u.id === userId ? { ...u, ...updates } : u
        );
        
        set({ users: updatedUsers });
        
        // Update current user if they updated their own profile
        if (currentUser.id === userId) {
          set({ currentUser: { ...currentUser, ...updates } });
        }
        
        return { success: true, message: 'Profile updated successfully' };
      },
      
      approveUser: (userId) => {
        const { users } = get();
        const updatedUsers = users.map(u => 
          u.id === userId ? { ...u, status: 'active' as const } : u
        );
        set({ users: updatedUsers });
      },
      
      suspendUser: (userId) => {
        const { users } = get();
        const updatedUsers = users.map(u => 
          u.id === userId ? { ...u, status: 'suspended' as const } : u
        );
        set({ users: updatedUsers });
      },
      
      activateUser: (userId) => {
        const { users } = get();
        const updatedUsers = users.map(u => 
          u.id === userId ? { ...u, status: 'active' as const } : u
        );
        set({ users: updatedUsers });
      },
      
      deleteUser: (userId) => {
        const { users, currentUser } = get();
        
        // Prevent admin from deleting themselves
        if (currentUser?.id === userId) {
          return;
        }
        
        const updatedUsers = users.filter(u => u.id !== userId);
        set({ users: updatedUsers });
      },
      
      resetUserPassword: (userId, newPassword) => {
        const { users } = get();
        const updatedUsers = users.map(u => 
          u.id === userId ? { ...u, password: newPassword } : u
        );
        set({ users: updatedUsers });
      },
      
      toggleSignups: () => {
        const { allowSignups } = get();
        set({ allowSignups: !allowSignups });
      },
      
      toggleApproval: () => {
        const { requireApproval } = get();
        set({ requireApproval: !requireApproval });
      },
      
      updateUserLanguage: (userId, language) => {
        const { users, currentUser } = get();
        
        // Update the user's language preference
        const updatedUsers = users.map(u => 
          u.id === userId ? { ...u, language } : u
        );
        
        set({ users: updatedUsers });
        
        // Update current user if they changed their own language
        if (currentUser && currentUser.id === userId) {
          set({ currentUser: { ...currentUser, language } });
        }
      },
      
      getUserById: (userId) => {
        const { users } = get();
        return users.find(u => u.id === userId);
      },
      
      isAdmin: () => {
        const { currentUser } = get();
        return currentUser?.role === 'admin';
      },
      
      unlockUser: (userId) => {
        const { users } = get();
        const updatedUsers = users.map(u => 
          u.id === userId 
            ? { 
                ...u, 
                failedLoginAttempts: 0,
                lockedUntil: undefined
              } 
            : u
        );
        set({ users: updatedUsers });
      },
      
      isUserLocked: (user) => {
        return !!(user.lockedUntil && new Date(user.lockedUntil) > new Date());
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        users: state.users,
        allowSignups: state.allowSignups,
        requireApproval: state.requireApproval,
      }),
    }
  )
);
