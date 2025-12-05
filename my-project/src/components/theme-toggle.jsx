import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './theme-provider'

export function ThemeToggle() {
  const { theme } = useTheme()

  return (
    <div className="relative flex items-center justify-center w-9 h-9">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </div>
  )
}