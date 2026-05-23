'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  loading: true,
  refreshUser: async () => { },
  logout: async () => { }
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const json = await res.json();
        setUser(json.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth initialization error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Also clear any legacy localStorage tokens
      localStorage.removeItem('token');
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    router.push('/auth');
  };

  const value = {
    user,
    setUser,
    loading,
    refreshUser: fetchUser,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
