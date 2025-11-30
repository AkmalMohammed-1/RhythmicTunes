import React, { createContext, useContext, useState, useEffect } from 'react'
import { userService } from '../services'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is already logged in on app start
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('rhythmic-tunes-token')
      const userData = localStorage.getItem('rhythmic-tunes-user')
      
      if (token && userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      logout() // Clear invalid data
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API login - replace with real API call
      const users = await userService.getAllUsers() // You'll need to add this method
      const foundUser = users.find(u => u.email === email)

      if (!foundUser) {
        throw new Error('User not found')
      }

      // In real app, password would be hashed and verified on backend
      if (foundUser.password !== password) {
        throw new Error('Invalid password')
      }

      // Generate a simple token (in real app, this comes from backend)
      const token = `token_${foundUser.id}_${Date.now()}`

      // Store auth data
      localStorage.setItem('rhythmic-tunes-token', token)
      localStorage.setItem('rhythmic-tunes-user', JSON.stringify(foundUser))

      setUser(foundUser)
      return { success: true, user: foundUser }

    } catch (error) {
      const errorMessage = error.message || 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    try {
      setLoading(true)
      setError(null)

      // Check if user already exists
      const users = await userService.getAllUsers()
      const existingUser = users.find(u => u.email === userData.email)

      if (existingUser) {
        throw new Error('User already exists with this email')
      }

      // Create new user
      const newUser = await userService.createUser({
        ...userData,
        created_at: new Date().toISOString(),
        preferences: {
          theme: 'dark',
          autoplay: true,
          volume: 80,
          quality: 'high'
        },
        recently_played: []
      })

      // Generate token
      const token = `token_${newUser.id}_${Date.now()}`

      // Store auth data
      localStorage.setItem('rhythmic-tunes-token', token)
      localStorage.setItem('rhythmic-tunes-user', JSON.stringify(newUser))

      setUser(newUser)
      return { success: true, user: newUser }

    } catch (error) {
      const errorMessage = error.message || 'Signup failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('rhythmic-tunes-token')
    localStorage.removeItem('rhythmic-tunes-user')
    setUser(null)
    setError(null)
  }

  const updateUser = async (updatedData) => {
    try {
      if (!user) return { success: false, error: 'No user logged in' }

      const updatedUser = await userService.updateUser(user.id, {
        ...user,
        ...updatedData
      })

      localStorage.setItem('rhythmic-tunes-user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      return { success: true, user: updatedUser }
    } catch (error) {
      const errorMessage = error.message || 'Update failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const clearError = () => setError(null)

  const isAuthenticated = !!user

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

export default AuthContext