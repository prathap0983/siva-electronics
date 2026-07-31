import React from 'react';

export const Skeleton = ({ className = '', variant = 'card' }) => {
  const baseClasses = 'bg-slate-200 dark:bg-slate-800 animate-pulse rounded';

  if (variant === 'text') {
    return <div className={`h-4 w-full ${baseClasses} ${className}`} />;
  }

  if (variant === 'title') {
    return <div className={`h-6 w-3/4 ${baseClasses} ${className}`} />;
  }

  if (variant === 'circle') {
    return <div className={`rounded-full ${baseClasses} ${className}`} />;
  }

  if (variant === 'table-row') {
    return (
      <div className={`flex items-center gap-4 py-3 px-4 border-b border-slate-100 dark:border-slate-800 ${className}`}>
        <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="flex-grow space-y-2">
          <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-1/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      </div>
    );
  }

  // Default: Card Variant
  return (
    <div className={`border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 space-y-4 bg-white dark:bg-slate-900 ${className}`}>
      <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse animate-delay-100" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 w-1/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="h-9 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
      </div>
    </div>
  );
};
export default Skeleton;
