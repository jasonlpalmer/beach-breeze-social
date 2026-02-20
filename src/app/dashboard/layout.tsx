'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/create': 'Create Post',
  '/dashboard/posts': 'My Posts',
  '/dashboard/settings': 'Settings',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const title =
    pageTitles[pathname] ||
    (pathname.startsWith('/dashboard/posts/') ? 'Edit Post' : 'Dashboard');

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-foam-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
