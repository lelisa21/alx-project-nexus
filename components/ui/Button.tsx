
"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-slate-950 text-white hover:bg-slate-800 focus:ring-emerald-500 shadow-sm hover:shadow',
      secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 focus:ring-emerald-500 shadow-sm hover:shadow',
      outline: 'border border-slate-300 text-slate-800 hover:bg-slate-100 focus:ring-emerald-500',
      ghost: 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 focus:ring-emerald-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {Icon && iconPosition === 'left' && !loading && (
          <Icon className={cn('h-4 w-4', children ? 'mr-2' : '')} />
        )}
        {children}
        {Icon && iconPosition === 'right' && (
          <Icon className={cn('h-4 w-4', children ? 'ml-2' : '')} />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
