import React from 'react';
import { cn } from '@/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className, id, ...props }) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-mono uppercase tracking-[0.12em] text-ink-400">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300">{icon}</div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full h-11 bg-sand-50 border border-sand-300 text-ink font-body text-sm',
            'placeholder:text-ink-300 transition-colors duration-150',
            'focus:outline-none focus:border-ink focus:bg-white',
            'rounded-none',
            icon ? 'pl-10 pr-4' : 'px-4',
            error && 'border-red-400 focus:border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-body">{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className, id, ...props }) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-mono uppercase tracking-[0.12em] text-ink-400">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={cn(
          'w-full h-11 bg-sand-50 border border-sand-300 text-ink font-body text-sm px-4',
          'focus:outline-none focus:border-ink focus:bg-white transition-colors rounded-none',
          'appearance-none cursor-pointer',
          error && 'border-red-400',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 font-body">{error}</p>}
    </div>
  );
};
