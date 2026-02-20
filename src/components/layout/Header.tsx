'use client';

import Link from 'next/link';
import { Menu, PlusCircle } from 'lucide-react';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-foam-200 bg-white px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-foam-100 lg:hidden"
        >
          <Menu size={20} className="text-deep-600" />
        </button>
        <h2 className="font-display text-xl font-bold text-deep-600">
          {title}
        </h2>
      </div>
      <Link
        href="/dashboard/create"
        className="flex items-center gap-2 rounded-xl bg-ocean-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ocean-600"
      >
        <PlusCircle size={18} />
        New Post
      </Link>
    </header>
  );
}
