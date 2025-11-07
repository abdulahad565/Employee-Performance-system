// // frontend/src/context/AuthContext.js

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { authAPI } from '../services/api';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     initializeAuth();
//   }, []);

//   // const initializeAuth = async () => {
//   //   try {
//   //     setLoading(true);
//   //     await authAPI.getCSRFToken();
//   //     await checkAuthStatus();
//   //   } catch (error) {
//   //     console.error('Auth initialization error:', error);
//   //     setUser(null);
//   //     setIsAuthenticated(false);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
// const initializeAuth = async () => {
//     try {
//       setLoading(true);
//       // Assuming the correct endpoint is /api/v1/csrf
//       await authAPI.getCSRFToken('/api/v1/csrf');
//       await checkAuthStatus();
//     } catch (error) {
//       console.error('Auth initialization error:', error);
//       setUser(null);
//       setIsAuthenticated(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkAuthStatus = async () => {
//     try {
//       const response = await authAPI.checkAuth();
//       if (response.data.authenticated) {
//         setUser(response.data.user);
//         setIsAuthenticated(true);
//       } else {
//         setUser(null);
//         setIsAuthenticated(false);
//       }
//     } catch (error) {
//       console.error('Auth check error:', error);
//       setUser(null);
//       setIsAuthenticated(false);
//     }
//   };

//   const signup = async (userData) => {
//     try {
//       await authAPI.getCSRFToken();
//       const response = await authAPI.signup(userData);
//       if (response.data.success) {
//         setUser(response.data.user);
//         setIsAuthenticated(true);
//         return { success: true };
//       }
//       return { success: false, error: 'Signup failed' };
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Signup failed';
//       return { success: false, error: errorMessage };
//     }
//   };

//   const login = async (credentials) => {
//     try {
//       await authAPI.getCSRFToken();
//       const response = await authAPI.login(credentials);
//       if (response.data.success) {
//         setUser(response.data.user);
//         setIsAuthenticated(true);
//         return { success: true };
//       }
//       return { success: false, error: 'Login failed' };
//     } catch (error) {
//       const errorMessage = error.response?.data?.error || 'Login failed';
//       return { success: false, error: errorMessage };
//     }
//   };

//   const logout = async () => {
//     try {
//       await authAPI.logout();
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       setUser(null);
//       setIsAuthenticated(false);
//     }
//   };

//   const isAdmin = () => {
//     return user && (user.is_staff || user.is_superuser);
//   };

//   const value = {
//     user,
//     isAuthenticated,
//     loading,
//     login,
//     signup,
//     logout,
//     isAdmin,
//     checkAuthStatus
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// frontend/src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      // Get CSRF token first
      await authAPI.getCSRFToken();
      // Then check if user is authenticated
      await checkAuthStatus();
    } catch (error) {
      console.error('Auth initialization error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.checkAuth();
      if (response.data.authenticated) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const signup = async (userData) => {
    try {
      // Get fresh CSRF token before signup
      await authAPI.getCSRFToken();
      
      const response = await authAPI.signup(userData);
      console.log('Signup response:', response.data); // Debug log
      
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: response.data.error || 'Signup failed' };
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Signup failed';
      return { success: false, error: errorMessage };
    }
  };

  const login = async (credentials) => {
    try {
      // Get fresh CSRF token before login
      await authAPI.getCSRFToken();
      
      const response = await authAPI.login(credentials);
      console.log('Login response:', response.data); // Debug log
      
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: response.data.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const isAdmin = () => {
    return user && (user.is_staff || user.is_superuser);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    isAdmin,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};