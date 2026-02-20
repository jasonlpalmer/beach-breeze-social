'use client';

import { Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerateButtonProps {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export default function GenerateButton({
  loading,
  disabled,
  onClick,
}: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={cn(
        'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all',
        loading || disabled
          ? 'cursor-not-allowed bg-foam-200 text-foam-300'
          : 'bg-gradient-to-r from-coral-500 to-coral-400 text-white shadow-md hover:shadow-lg'
      )}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles size={18} />
          Generate with AI
        </>
      )}
    </button>
  );
}
