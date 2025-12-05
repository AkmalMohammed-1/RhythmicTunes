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
import { Music, Eye, EyeOff, Loader2 } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, error, clearError } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    
    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields')
      return
    }

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      navigate('/') // Redirect to home page
    } else {
      setFormError(result.error)
    }
  }

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
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your music library
            </CardDescription>
            <CardAction>
              <Button 
                variant="link" 
                onClick={() => navigate('/signup')}
                className="p-0 h-auto"
              >
                Don't have an account? Sign up
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex-col gap-3">
            <Button 
              type="submit" 
              className="w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage