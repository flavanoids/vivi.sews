import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Users, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLanguage } from '../contexts/LanguageContext';

interface PendingUser {
  id: string;
  email: string;
  username: string;
  role: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  console.log('AdminDashboard: Component rendering');
  
  const navigate = useNavigate();
  const { currentUser, isAdmin, getPendingUsers, approveUser, rejectUser } = useAuthStore();
  const { t } = useLanguage();
  
  console.log('AdminDashboard: currentUser:', currentUser);
  console.log('AdminDashboard: isAdmin():', isAdmin());
  
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadPendingUsers = useCallback(async () => {
    console.log('AdminDashboard: loadPendingUsers called');
    try {
      setIsLoading(true);
      setError(null);
      const result = await getPendingUsers();
      console.log('AdminDashboard: getPendingUsers result:', result);
      if (result.success) {
        setPendingUsers(result.data || []);
      } else {
        setError(result.message || 'Failed to load pending users');
      }
    } catch (err) {
      console.error('Error loading pending users:', err);
      setError('An unexpected error occurred while loading pending users');
    } finally {
      setIsLoading(false);
    }
  }, [getPendingUsers]);

  useEffect(() => {
    console.log('AdminDashboard: useEffect triggered');
    console.log('AdminDashboard: currentUser in useEffect:', currentUser);
    console.log('AdminDashboard: isAdmin() in useEffect:', isAdmin());
    
    // Check if user is authenticated and is admin
    if (!currentUser) {
      console.log('AdminDashboard: No currentUser, navigating to login');
      navigate('/login');
      return;
    }
    
    if (!isAdmin()) {
      console.log('AdminDashboard: Not admin, navigating to dashboard');
      navigate('/');
      return;
    }

    console.log('AdminDashboard: User is admin, loading pending users');
    // Load pending users
    loadPendingUsers();
  }, [currentUser, isAdmin, navigate, loadPendingUsers]);

  const handleApprove = async (userId: string) => {
    try {
      const result = await approveUser(userId);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        loadPendingUsers(); // Reload the list
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (err) {
      console.error('Error approving user:', err);
      setMessage({ type: 'error', text: 'An unexpected error occurred while approving user' });
    }
  };

  const handleReject = async (userId: string) => {
    if (window.confirm('Are you sure you want to reject this user? This action cannot be undone.')) {
      try {
        const result = await rejectUser(userId);
        if (result.success) {
          setMessage({ type: 'success', text: result.message });
          loadPendingUsers(); // Reload the list
        } else {
          setMessage({ type: 'error', text: result.message });
        }
      } catch (err) {
        console.error('Error rejecting user:', err);
        setMessage({ type: 'error', text: 'An unexpected error occurred while rejecting user' });
      }
    }
  };

  console.log('AdminDashboard: About to render, currentUser:', currentUser, 'isAdmin:', isAdmin());

  // Show loading state while checking authentication
  if (!currentUser) {
    console.log('AdminDashboard: Rendering loading state (no currentUser)');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin()) {
    console.log('AdminDashboard: Rendering access denied (not admin)');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  console.log('AdminDashboard: Rendering main admin dashboard');
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600 mt-2">Manage user approvals and system settings</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
            <button 
              onClick={loadPendingUsers}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Pending Users Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Pending User Approvals</h2>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading pending users...</p>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No pending users to approve</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{user.username}</h3>
                      <p className="text-gray-600 text-sm">{user.email}</p>
                      <p className="text-gray-500 text-xs">
                        Requested: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Info */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="font-medium">{currentUser.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{currentUser.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-medium capitalize">{currentUser.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium capitalize">{currentUser.status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
