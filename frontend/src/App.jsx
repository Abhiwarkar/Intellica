import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Analytics from './pages/analytics/Analytics';
import UserManagement from './pages/settings/UserManagement'; 
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';
import Integrations from './pages/integrations/Integrations';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Role-based protection component
const RoleProtectedRoute = ({ children, requiredRole }) => {
  const { hasRole } = useContext(AuthContext);
  
  if (!hasRole(requiredRole)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes with DashboardLayout */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Child routes that will render inside <Outlet /> */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="integrations" element={<Integrations />} />
        
        <Route 
          path="reports" 
          element={
            <RoleProtectedRoute requiredRole="analyst">
              <Reports />
            </RoleProtectedRoute>
          } 
        />
        
    
        <Route 
          path="users" 
          element={
            <RoleProtectedRoute requiredRole="admin">
              <UserManagement />
            </RoleProtectedRoute>
          } 
        />
        
        <Route 
          path="settings" 
          element={
            <RoleProtectedRoute requiredRole="admin">
              <Settings />
            </RoleProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route index element={<Navigate to="/dashboard" />} />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;