import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Settings, 
  Shield, 
  UserCheck, 
  UserX, 
  UserPlus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useAuthStore, type User } from '../store/authStore';
import { useFabricStore } from '../store/fabricStore';

export default function AdminDashboard() {
  const { 
    users, 
    currentUser, 
    logout, 
    approveUser, 
    suspendUser, 
    activateUser, 
    deleteUser, 
    resetUserPassword,
    allowSignups, 
    requireApproval,
    toggleSignups, 
    toggleApproval
  } = useAuthStore();
  
  const { isDarkMode, toggleDarkMode } = useFabricStore();
  
  const { getUserFabrics, getUserProjects, getUserUsageHistory } = useFabricStore();
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'settings'>('users');

  // Filter out admin from user list
  const regularUsers = users.filter(user => user.role === 'user');
  const pendingUsers = regularUsers.filter(user => user.status === 'pending');
  const activeUsers = regularUsers.filter(user => user.status === 'active');
  const suspendedUsers = regularUsers.filter(user => user.status === 'suspended');

  const handlePasswordReset = () => {
    if (selectedUser && newPassword.trim()) {
      resetUserPassword(selectedUser.id, newPassword);
      setShowPasswordReset(false);
      setNewPassword('');
      setSelectedUser(null);
    }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getUserStats = (userId: string) => {
    const fabrics = getUserFabrics(userId);
    const projects = getUserProjects(userId);
    const usageHistory = getUserUsageHistory(userId);
    
    return {
      fabrics: fabrics.length,
      projects: projects.length,
      totalUsage: usageHistory.length,
    };
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <div className="min-h-screen bg-white/30 dark:bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have permission to access the admin dashboard.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="min-h-screen bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2 sm:p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <Link 
                  to="/"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  ← Back to App
                </Link>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-8 h-8 text-purple-600" />
                    Admin Dashboard
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">Manage users and application settings</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{regularUsers.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <UserPlus className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Approval</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingUsers.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeUsers.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Suspended</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{suspendedUsers.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === 'users'
                      ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-5 h-5 inline mr-2" />
                  User Management
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === 'settings'
                      ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Settings className="w-5 h-5 inline mr-2" />
                  Settings
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'users' && (
                <div className="space-y-6">
                  {/* Pending Users */}
                  {pendingUsers.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-yellow-600" />
                        Pending Approval ({pendingUsers.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pendingUsers.map(user => {
                          const stats = getUserStats(user.id);
                          return (
                            <div key={user.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">{user.username}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                  {user.status}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                                <p>Fabrics: {stats.fabrics} | Projects: {stats.projects}</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => approveUser(user.id)}
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => deleteUser(user.id)}
                                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* All Users */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      All Users ({regularUsers.length})
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">User</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Stats</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {regularUsers.map(user => {
                            const stats = getUserStats(user.id);
                            return (
                              <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700">
                                <td className="py-3 px-4">
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                                    <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                    {user.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                  <p>Fabrics: {stats.fabrics}</p>
                                  <p>Projects: {stats.projects}</p>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex gap-2">
                                    {user.status === 'pending' && (
                                      <button
                                        onClick={() => approveUser(user.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors"
                                      >
                                        Approve
                                      </button>
                                    )}
                                    {user.status === 'suspended' && (
                                      <button
                                        onClick={() => activateUser(user.id)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                                      >
                                        Activate
                                      </button>
                                    )}
                                    {user.status === 'active' && (
                                      <button
                                        onClick={() => suspendUser(user.id)}
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs transition-colors"
                                      >
                                        Suspend
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setShowPasswordReset(true);
                                      }}
                                      className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs transition-colors"
                                    >
                                      Reset PW
                                    </button>
                                    <button
                                      onClick={() => deleteUser(user.id)}
                                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Allow Signups</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {allowSignups ? 'New users can create accounts' : 'New user registration is disabled'}
                          </p>
                        </div>
                        <button
                          onClick={toggleSignups}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            allowSignups ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              allowSignups ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Require Approval</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {requireApproval ? 'New accounts require admin approval' : 'New accounts are automatically activated'}
                          </p>
                        </div>
                        <button
                          onClick={toggleApproval}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            requireApproval ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              requireApproval ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showPasswordReset && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reset Password for {selectedUser.username}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordReset(false);
                  setNewPassword('');
                  setSelectedUser(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
