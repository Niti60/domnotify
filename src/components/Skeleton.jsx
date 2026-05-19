'use client';

export default function Skeleton({ className = '', width = 'w-full', height = 'h-4' }) {
  return (
    <div className={`${width} ${height} bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse ${className}`}></div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
      <Skeleton width="w-32" height="h-6" className="mb-3" />
      <Skeleton height="h-4" className="mb-2" />
      <Skeleton width="w-5/6" height="h-4" />
    </div>
  );
}
