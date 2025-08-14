# Vivi.Sews - Fabric Management System

A comprehensive fabric and project management system with user authentication and admin features.

## Features

### 🔐 Authentication System
- **User Registration**: Create accounts with email, username, and password
- **Flexible Login**: Login with either email or username
- **Password Management**: Users can change their own passwords
- **Admin Password Reset**: Admins can reset any user's password
- **Account Status**: Active, pending, and suspended account states
- **Admin Approval**: Optional admin approval for new accounts

### 👤 User Management
- **User-Specific Data**: All fabrics, projects, and usage history are tied to individual accounts
- **Data Isolation**: Users cannot access other users' information
- **Profile Management**: View account information and activity stats
- **Password Security**: Secure password change functionality

### 🛡️ Admin Features
- **User Management**: Approve, suspend, activate, and delete users
- **System Settings**: Toggle signup availability and approval requirements
- **User Statistics**: View user activity and data usage
- **Password Administration**: Reset passwords for any user
- **Dashboard**: Comprehensive admin dashboard with user overview

### 🧵 Fabric Management
- **Fabric Inventory**: Track fabric types, colors, quantities, and costs
- **Usage Tracking**: Record fabric usage for projects
- **Image Support**: Upload and manage fabric images
- **Search & Filter**: Find fabrics by name, type, or color
- **Pinning System**: Pin important fabrics for quick access

### 📋 Project Management
- **Project Creation**: Create sewing projects with descriptions and target dates
- **Material Tracking**: Link fabrics to projects and track usage
- **Status Management**: Planning, in-progress, completed, and on-hold states
- **Project Images**: Add images to projects
- **Notes & Details**: Add detailed notes and descriptions

## Demo Accounts

Demo credentials are stored in `config/demo-credentials.json` for easy access and management.

### Default Admin Account
**Username**: ADMIN  
**Password**: pineda0322

### Demo User Accounts
- **Regular User**: john_doe / password123
- **Pending User**: jane_smith / password123

> **Note**: These are demo credentials for development/testing. Change passwords immediately in production.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Access the Application**:
   - Open your browser to the URL shown in the terminal
   - Login with the admin credentials or create a new account

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Zustand with persistence
- **Styling**: Tailwind CSS with dark mode support
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite

## Security Features

- **User Isolation**: Complete data separation between users
- **Role-Based Access**: Admin and user roles with appropriate permissions
- **Account Status Management**: Control user access through status states
- **Password Validation**: Minimum length and confirmation requirements
- **Admin Controls**: Comprehensive admin tools for user management

## Data Persistence

All data is stored locally using Zustand's persistence middleware. In a production environment, this would be replaced with a proper backend database.

## Admin Dashboard Features

- **User Overview**: View all users with their status and activity
- **Pending Approvals**: Manage users waiting for account approval
- **System Settings**: Control signup availability and approval requirements
- **User Statistics**: View fabric counts, project counts, and usage history
- **Bulk Actions**: Approve, suspend, or delete users
- **Password Management**: Reset passwords for any user

## User Profile Features

- **Account Information**: View email, username, role, and join date
- **Activity Statistics**: See fabric count, project count, and usage records
- **Password Management**: Change password with current password verification
- **Account Status**: View verification and account status
- **Quick Actions**: Easy navigation to dashboard and admin panel (if admin)
