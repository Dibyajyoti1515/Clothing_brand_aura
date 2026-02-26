import React from 'react';
import { cn } from '../../utils/index.ts';

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className }) => (
  <span className={cn('inline-flex items-center px-2.5 py-0.5 text-xs font-mono tracking-wider rounded-sm', className)}>
    {children}
  </span>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={cn(
      'bg-gradient-to-r from-sand-200 via-sand-100 to-sand-200 bg-[length:200%_100%] animate-shimmer rounded-none',
      className
    )}
  />
);

// ─── Empty State ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 px-8 text-center animate-fade-in">
    <div className="text-ink-200 mb-4">{icon}</div>
    <h3 className="font-display text-xl text-ink mb-2">{title}</h3>
    {description && <p className="font-body text-ink-400 text-sm mb-6 max-w-xs">{description}</p>}
    {action}
  </div>
);

// ─── Divider ──────────────────────────────────────────────────────────────────
export const Divider: React.FC<{ className?: string; label?: string }> = ({ className, label }) =>
  label ? (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 h-px bg-sand-300" />
      <span className="text-xs font-mono text-ink-300 tracking-widest uppercase">{label}</span>
      <div className="flex-1 h-px bg-sand-300" />
    </div>
  ) : (
    <div className={cn('h-px bg-sand-200', className)} />
  );