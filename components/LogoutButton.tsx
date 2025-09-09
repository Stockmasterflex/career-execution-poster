'use client'

import { Button } from '@/components/ui/Button'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  onSignOut: () => void
}

export function LogoutButton({ onSignOut }: LogoutButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onSignOut}
      className="text-white/80 hover:text-white hover:bg-white/10"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  )
}