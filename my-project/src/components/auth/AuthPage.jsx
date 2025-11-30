import React, { useState } from 'react'
import Login from './Login'
import Signup from './Signup'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  const switchToSignup = () => setIsLogin(false)
  const switchToLogin = () => setIsLogin(true)

  return (
    <>
      {isLogin ? (
        <Login onSwitchToSignup={switchToSignup} />
      ) : (
        <Signup onSwitchToLogin={switchToLogin} />
      )}
    </>
  )
}

export default AuthPage