'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { apiFetch } from '@/lib/apiClient';

function sanitizeNextPath(nextPath) {
  if (typeof nextPath !== 'string' || !nextPath.startsWith('/admin')) {
    return '/admin/dashboard';
  }

  return nextPath;
}

export function AdminLoginPanel({ nextPath = '/admin/dashboard' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const destination = sanitizeNextPath(nextPath);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiFetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Force a full navigation so the browser includes the newly-set
      // httpOnly cookie on the request. This avoids middleware seeing an
      // unauthenticated request when the SPA navigates too quickly.
      window.location.replace(destination);
    } catch (err) {
      setError(err.message || 'Admin authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted">
            <ShieldAlert size={20} className="text-foreground" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Admin Control Center
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Authorized personnel only.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Admin email"
            type="email"
            placeholder="admin@domnotify.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Authenticating
              </span>
            ) : (
              'Enter Admin'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
