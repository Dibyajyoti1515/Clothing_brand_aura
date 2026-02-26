import React from 'react';
import { cn } from '@/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-ink text-sand-50 hover:bg-ink-500 active:scale-[0.98] shadow-sm',
  secondary: 'bg-clay text-white hover:bg-clay-dark active:scale-[0.98] shadow-sm',
  ghost: 'text-ink hover:bg-sand-200 active:bg-sand-300',
  outline: 'border border-ink-200 text-ink hover:border-ink hover:bg-sand-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
};

const sizes = {
  sm: 'h-8 px-3 text-xs tracking-wide',
  md: 'h-10 px-5 text-sm tracking-wide',
  lg: 'h-12 px-7 text-base tracking-wider',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}) => (
  <button
    className={cn(
      'inline-flex items-center justify-center gap-2 font-body font-medium rounded-none transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      className
    )}
    disabled={disabled || loading}
    {...props}
  >
    {loading && (
      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    )}
    {children}
  </button>
);
