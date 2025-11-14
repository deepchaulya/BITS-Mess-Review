import api from './api';

const authService = {
  // Sign up new user
  signUp: async (name, email, password) => {
    try {
      const response = await api.post('/auth/signup', {
        name,
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        }));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Sign up failed. Please try again.';
    }
  },

  // Sign in existing user
  signIn: async (email, password) => {
    try {
      const response = await api.post('/auth/signin', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        }));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Sign in failed. Please check your credentials.';
    }
  },

  // Sign out
  signOut: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },
};

export default authService;
