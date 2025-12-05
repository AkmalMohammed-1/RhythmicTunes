import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from './theme-provider'

export function ThemeSync() {
  const { user } = useAuth()
  const { setTheme } = useTheme()

  useEffect(() => {
    // Sync user's theme preference with ThemeProvider when user changes
    if (user?.preferences?.theme) {
      setTheme(user.preferences.theme)
    }
  }, [user, setTheme])

  return null // This component doesn't render anything
}