'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Settings,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/create', label: 'Create Post', icon: PlusCircle },
  { href: '/dashboard/posts', label: 'My Posts', icon: FileText },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-gradient-to-b from-deep-600 to-deep-700 text-white transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Beach Breeze Boxers"
              width={48}
              height={48}
              className="rounded-xl"
            />
            <div>
              <h1 className="font-display text-lg font-bold leading-tight">
                Beach Breeze
              </h1>
              <p className="text-xs text-ocean-300">Social Manager</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-ocean-500/20 text-ocean-200'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center justify-center gap-2 rounded-xl bg-ocean-600/30 p-3 text-center text-xs text-ocean-200">
            <Image
              src="/logo.png"
              alt="Beach Breeze Boxers"
              width={24}
              height={24}
              className="rounded"
            />
            Beach Breeze Boxers
          </div>
        </div>
      </aside>
    </>
  );
}
