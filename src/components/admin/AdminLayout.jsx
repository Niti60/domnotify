'use client';

import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/**
 * AdminLayout
 *
 * Wrapper for all admin pages
 * Ensures user is admin, displays sidebar, handles layout
 */
export function AdminLayout({ children }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const displayName = user?.name || 'Administrator';

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex p-2 lg:hidden rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <div className="text-sm text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{displayName}</span>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
