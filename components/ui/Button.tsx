import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className, 
  ...props 
}: ButtonProps) {
  const variants = {
    default: 'bg-bg-primary text-text-white hover:bg-bg-secondary',
    primary: 'bg-gradient-dashboard text-white hover:opacity-90',
    secondary: 'bg-bg-surface text-text-primary hover:bg-gray-200',
    outline: 'border border-gray-300 bg-bg-card text-text-primary hover:bg-bg-surface',
    ghost: 'text-text-primary hover:bg-bg-surface',
    destructive: 'bg-error text-white hover:bg-red-700',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
