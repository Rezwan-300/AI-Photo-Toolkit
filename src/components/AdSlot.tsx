import React from 'react';

interface AdSlotProps {
  type: 'banner' | 'sidebar' | 'inline';
  className?: string;
}

export function AdSlot({ type, className }: AdSlotProps) {
  const getLabel = () => {
    switch (type) {
      case 'banner': return 'Top Banner Ad';
      case 'sidebar': return 'Sidebar Ad';
      case 'inline': return 'Sponsored Content';
      default: return 'Advertisement';
    }
  };

  const getHeight = () => {
    switch (type) {
      case 'banner': return 'h-24';
      case 'sidebar': return 'h-[600px]';
      case 'inline': return 'h-48';
      default: return 'h-32';
    }
  };

  return (
    <div className={cn(
      "bg-neutral-900/50 border border-neutral-800 rounded-lg flex items-center justify-center text-neutral-500 text-sm font-medium overflow-hidden relative group",
      getHeight(),
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex flex-col items-center gap-2">
        <span className="uppercase tracking-widest text-[10px] opacity-50">Advertisement</span>
        <span>{getLabel()}</span>
      </div>
    </div>
  );
}

import { cn } from '../lib/utils';
