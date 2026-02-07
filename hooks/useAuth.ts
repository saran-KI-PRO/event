import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export const useAuth = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize admin credentials if they don't exist
    storage.initAdminCredentials();
    
    // Check if user is already logged in
    const token = storage.getAuthToken();
    if (token) {
      setAuthState({ 
        isAuthenticated: true, 
        user: { email: 'admin@eventapp.com' } 
      });
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    // This now works because getAdminCredentials is defined in storage.ts
    const admin = storage.getAdminCredentials();
    
    if (email === admin.email && password === admin.password) {
      storage.setAuthToken('authenticated');
      setAuthState({ 
        isAuthenticated: true, 
        user: { email: admin.email } 
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    storage.clearAuthToken();
    setAuthState({ isAuthenticated: false, user: null });
  };

  return { authState, login, logout, isLoading };
};