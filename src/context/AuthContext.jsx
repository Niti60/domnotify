'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  loading: false,
  refreshUser: async () => { },
  logout: async () => { }
});

/**
 * AuthProvider
 * 
 * Note: Route protection is primarily handled by Next.js middleware.
 * This context is responsible for:
 * 1. Fetching and caching user profile data
 * 2. Providing logout functionality
 * 3. Tracking auth loading state for UI
 * 
 * By the time a protected page reaches this component, middleware has
 * already verified the user's JWT token is valid.
 */
export function AuthProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const controller = new AbortController();
      // Timeout after 5 seconds to avoid hanging
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        setUser(json.user);
      } else {
        // Auth endpoint returned error - user likely unauthenticated
        setUser(null);
      }
    } catch (err) {
      console.error("[Auth] Initialization error:", err);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      });
      // Also clear any legacy localStorage tokens
      localStorage.removeItem('token');
    } catch (err) {
      console.error("[Auth] Logout error:", err);
    }
    setUser(null);
    router.push('/auth');
  };

  const value = {
    user,
    setUser,
    loading,
    refreshUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;
