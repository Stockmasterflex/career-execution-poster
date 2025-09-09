import React from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  error?: string
}

export function Checkbox({ 
  label, 
  description, 
  error, 
  className, 
  id,
  ...props 
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="space-y-1">
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id={checkboxId}
          className={cn(
            'mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        <div className="flex-1">
          {label && (
            <label 
              htmlFor={checkboxId}
              className="text-sm font-medium text-text-primary cursor-pointer"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-text-muted mt-1">{description}</p>
          )}
        </div>
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
}
