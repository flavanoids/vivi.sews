import { create } from 'zustand';
import { apiService } from '../services/api.js';

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
  getPendingUsers: () => Promise<{ success: boolean; data?: any; message?: string }>;
  approveUser: (userId: string) => Promise<{ success: boolean; message: string }>;
  rejectUser: (userId: string) => Promise<{ success: boolean; message: string }>;
  suspendUser: (userId: string) => void;
  activateUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  resetUserPassword: (userId: string, newPassword: string) => void;
  createAdminUser: (data: { email: string; username: string; password: string }) => Promise<{ success: boolean; message: string }>;
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

// Initialize with empty users array - users will be created through signup

export const useAuthStore = create<AuthStore>()((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  users: [],
  allowSignups: true,
  requireApproval: true,
  maxLoginAttempts: 5,
  lockoutDuration: 15, // 15 minutes
      
      login: async (credentials) => {
        set({ isLoading: true });
        
        try {
          const response = await apiService.login(credentials);
          apiService.setAuthToken(response.token);
          
          set({
            currentUser: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return { success: true, message: 'Login successful' };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, message: error.message || 'Login failed. Please try again.' };
        }
      },
      
      logout: () => {
        apiService.setAuthToken(null);
        set({
          currentUser: null,
          isAuthenticated: false,
        });
      },
      
      signup: async (data) => {
        try {
          if (data.password !== data.confirmPassword) {
            return { success: false, message: 'Passwords do not match' };
          }
          
          const response = await apiService.signup({
            email: data.email,
            username: data.username,
            password: data.password
          });
          
          return { success: true, message: response.message };
        } catch (error) {
          return { success: false, message: error.message || 'Signup failed. Please try again.' };
        }
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
        try {
          const response = await apiService.updateProfile(updates);
          
          // Update current user if they updated their own profile
          const { currentUser } = get();
          if (currentUser && currentUser.id === userId) {
            set({ currentUser: { ...currentUser, ...response.user } });
          }
          
          return { success: true, message: response.message };
        } catch (error) {
          return { success: false, message: error.message || 'Profile update failed' };
        }
      },

      // Admin methods
      getPendingUsers: async () => {
        try {
          const response = await apiService.getPendingUsers();
          return { success: true, data: response.pendingUsers };
        } catch (error) {
          return { success: false, message: error.message || 'Failed to get pending users' };
        }
      },

      approveUser: async (userId) => {
        try {
          const response = await apiService.approveUser(userId);
          return { success: true, message: response.message };
        } catch (error) {
          return { success: false, message: error.message || 'Failed to approve user' };
        }
      },

      rejectUser: async (userId) => {
        try {
          const response = await apiService.rejectUser(userId);
          return { success: true, message: response.message };
        } catch (error) {
          return { success: false, message: error.message || 'Failed to reject user' };
        }
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
      
      createAdminUser: async (data) => {
        const { users, currentUser } = get();
        
        // Only allow existing admins to create new admin users
        if (!currentUser || currentUser.role !== 'admin') {
          return { success: false, message: 'Only administrators can create admin users' };
        }
        
        // Validate input
        if (!data.email || !data.username || !data.password) {
          return { success: false, message: 'All fields are required' };
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
        
        // Create new admin user
        const newAdminUser: User = {
          id: `admin-${Date.now()}`,
          email: data.email.toLowerCase(),
          username: data.username,
          password: data.password, // In production, hash this
          role: 'admin',
          status: 'active',
          language: 'en',
          createdAt: new Date().toISOString(),
          isEmailVerified: true,
          failedLoginAttempts: 0,
        };
        
        set({
          users: [...users, newAdminUser],
        });
        
        return { success: true, message: 'Admin user created successfully' };
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
    })
  )
