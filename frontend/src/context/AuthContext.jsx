import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.data);
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return false;
    }
  };

  // Register function
const register = async (userData) => {
  try {
    setError(null);
    const response = await api.post('/auth/register', userData); 
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return true;
    }
  } catch (err) {
    setError(err.response?.data?.error || 'Registration failed');
    return false;
  }
};

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error,
        login, 
        register, 
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isAnalyst: user?.role === 'analyst' || user?.role === 'admin',
        hasRole: (role) => {
          if (!user) return false;
          if (role === 'admin') return user.role === 'admin';
          if (role === 'analyst') return ['admin', 'analyst'].includes(user.role);
          return true; 
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};