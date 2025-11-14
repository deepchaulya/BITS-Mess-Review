import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.signIn(email, password);
    setUser({
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role,
    });
    return response;
  };

  const register = async (name, email, password) => {
    const response = await authService.signUp(name, email, password);
    setUser({
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role,
    });
    return response;
  };

  const logout = () => {
    authService.signOut();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
