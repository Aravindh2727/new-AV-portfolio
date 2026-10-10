import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToAuthState, loginUser, logoutUser, resetPassword as firebaseResetPassword } from '@shared/firebase/auth';
import { isFirebaseConfigured } from '@shared/firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If Firebase is configured with real credentials, subscribe to Firebase Auth
    if (isFirebaseConfigured()) {
      const unsubscribe = subscribeToAuthState((user) => {
        setCurrentUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Offline/Local demo mode: check if demo session exists in sessionStorage
      const savedDemoUser = sessionStorage.getItem('admin_demo_session');
      if (savedDemoUser) {
        try {
          setCurrentUser(JSON.parse(savedDemoUser));
        } catch {}
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setError(null);
    if (isFirebaseConfigured()) {
      try {
        const user = await loginUser(email, password);
        setCurrentUser(user);
        return user;
      } catch (err) {
        setError(err.message || 'Authentication failed');
        throw err;
      }
    } else {
      throw new Error('Firebase authentication is not configured. Please check your .env variables.');
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured()) {
      await logoutUser();
    }
    sessionStorage.removeItem('admin_demo_session');
    setCurrentUser(null);
  };

  const resetPassword = async () => {
    if (isFirebaseConfigured()) {
      await firebaseResetPassword('aravindhvinayagam2007@gmail.com');
    } else {
      throw new Error('Firebase is not configured. Cannot reset password in local demo mode.');
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, login, logout, resetPassword, isFirebaseConfigured: isFirebaseConfigured() }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
