import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Music, Eye, EyeOff, Check, X, Loader2 } from 'lucide-react'

export function SignupPage() {
  const navigate = useNavigate()
  const { signup, loading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [formError, setFormError] = useState('')

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
    // Clear errors when user starts typing
    if (formError) setFormError('')
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username || !formData.email || !formData.password) {
      setFormError('Please fill in all fields')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match!')
      return
    }
    
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long')
      return
    }

    const result = await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      display_name: formData.username
    })
    
    if (result.success) {
      navigate('/') // Redirect to home page
    } else {
      setFormError(result.error)
    }
  }

  const passwordsMatch = formData.password === formData.confirmPassword
  const passwordEntered = formData.confirmPassword.length > 0

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Music className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl">RhythmicTunes</span>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Join RhythmicTunes and start your musical journey
            </CardDescription>
            <CardAction>
              <Button 
                variant="link" 
                onClick={() => navigate('/login')}
                className="p-0 h-auto"
              >
                Already have an account? Sign in
              </Button>
            </CardAction>
          </CardHeader>
          
          <CardContent>
            {(error || formError) && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                {error || formError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="absolute right-0 top-0 h-full flex items-center gap-1 px-3">
                      {passwordEntered && (
                        passwordsMatch ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-full px-2 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {passwordEntered && !passwordsMatch && (
                    <p className="text-sm text-red-500">Passwords do not match</p>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="underline hover:text-foreground">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="underline hover:text-foreground">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex-col gap-3">
            <Button 
              type="submit" 
              className="w-full"
              onClick={handleSubmit}
              disabled={!passwordsMatch || !passwordEntered || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default SignupPage