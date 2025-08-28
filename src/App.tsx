import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import { useFabricStore } from './store/fabricStore';
import { LanguageProvider } from './contexts/LanguageContext';
import { useEffect } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import AddFabric from './pages/AddFabric';
import EditFabric from './pages/EditFabric';
import Projects from './pages/Projects';
import AddProject from './pages/AddProject';
import ProjectDetail from './pages/ProjectDetail';
import EditProject from './pages/EditProject';
import Patterns from './pages/Patterns';
import AddPattern from './pages/AddPattern';
import PatternDetail from './pages/PatternDetail';
import EditPattern from './pages/EditPattern';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Admin Route Component
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, currentUser } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (currentUser?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const { isDarkMode } = useFabricStore();
  
  // Initialize authentication on app startup
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  // Apply dark mode to document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  return (
    <div>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              } />
              <Route path="/signup" element={
                isAuthenticated ? <Navigate to="/" replace /> : <Signup />
              } />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/add" element={
                <ProtectedRoute>
                  <AddFabric />
                </ProtectedRoute>
              } />
              <Route path="/test" element={
                <div className="min-h-screen flex items-center justify-center bg-blue-100">
                  <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-blue-600 mb-4">Test Page</h1>
                    <p className="text-gray-600">This is a simple test page to verify routing works.</p>
                  </div>
                </div>
              } />
              <Route path="/edit/:id" element={
                <ProtectedRoute>
                  <EditFabric />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />
              <Route path="/projects/add" element={
                <ProtectedRoute>
                  <AddProject />
                </ProtectedRoute>
              } />
              <Route path="/projects/:id" element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              } />
              <Route path="/projects/edit/:id" element={
                <ProtectedRoute>
                  <EditProject />
                </ProtectedRoute>
              } />
              <Route path="/patterns" element={
                <ProtectedRoute>
                  <Patterns />
                </ProtectedRoute>
              } />
              <Route path="/patterns/add" element={
                <ProtectedRoute>
                  <AddPattern />
                </ProtectedRoute>
              } />
              <Route path="/patterns/:id" element={
                <ProtectedRoute>
                  <PatternDetail />
                </ProtectedRoute>
              } />
              <Route path="/patterns/edit/:id" element={
                <ProtectedRoute>
                  <EditPattern />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </LanguageProvider>
    </div>
  );
}

export default App;
