'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function useAdminGuard() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const isAdmin = Boolean(user?.isAdmin);
  const ready = !loading && isAdmin;

  useEffect(() => {
    if (loading) return;

    if (!isAdmin) {
      router.replace('/dashboard');
    }
  }, [isAdmin, loading, router]);

  return {
    user,
    loading,
    isAdmin,
    ready,
  };
}