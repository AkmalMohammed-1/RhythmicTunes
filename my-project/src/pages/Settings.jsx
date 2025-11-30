import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Settings as SettingsIcon, Save, User, Mail, Eye, EyeOff } from 'lucide-react'

export function Settings() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    display_name: user?.display_name || '',
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      
      // Basic validation
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        alert('New passwords do not match')
        return
      }

      // Update user data (this would normally make an API call)
      const updatedUser = {
        ...user,
        display_name: formData.display_name,
        username: formData.username,
        email: formData.email
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update user in context (you'd need to implement updateUser in AuthContext)
      console.log('User updated:', updatedUser)
      
      setIsEditing(false)
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
      
      alert('Settings updated successfully!')
      
    } catch (error) {
      console.error('Failed to update settings:', error)
      alert('Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      display_name: user?.display_name || '',
      username: user?.username || '',
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setIsEditing(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <SettingsIcon className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              {isEditing ? (
                <Input
                  id="display_name"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleInputChange}
                  placeholder="Enter your display name"
                />
              ) : (
                <p className="py-2 px-3 bg-muted rounded-md">
                  {user?.display_name || 'Not set'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              {isEditing ? (
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                />
              ) : (
                <p className="py-2 px-3 bg-muted rounded-md">
                  {user?.username || 'Not set'}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              ) : (
                <p className="py-2 px-3 bg-muted rounded-md">
                  {user?.email || 'Not set'}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center gap-2 pt-4">
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Change */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Leave password fields empty if you don't want to change your password.
            </p>
          </CardContent>
        </Card>
      )}

      {/* App Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            App Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Theme</h4>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <select className="px-3 py-2 border rounded-md bg-background">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto-play</h4>
              <p className="text-sm text-muted-foreground">Automatically play similar songs when your music ends</p>
            </div>
            <input type="checkbox" className="h-4 w-4" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">High Quality Audio</h4>
              <p className="text-sm text-muted-foreground">Stream music in higher quality (uses more data)</p>
            </div>
            <input type="checkbox" className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings