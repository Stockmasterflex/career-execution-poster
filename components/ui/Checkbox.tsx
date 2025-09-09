import React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export function Checkbox({ checked, onCheckedChange, className }: CheckboxProps) {
  return (
    <button
      type="button"
      className={cn(
        'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
        checked 
          ? 'bg-white/20 border-white/40' 
          : 'bg-transparent border-white/30 hover:border-white/50',
        className
      )}
      onClick={() => onCheckedChange(!checked)}
    >
      {checked && <Check className="w-3 h-3 text-white" />}
    </button>
  )
}