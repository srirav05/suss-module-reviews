'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }
  const handleForgotPassword = async () => {
  if (!email) {
    setError('Enter your email above first, then click "Forgot password?"')
    return
  }
  setError('')
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) {
    setError(error.message)
  } else {
    setMessage('Check your email for a password reset link.')
  }
}

  return (
    <div className="max-w-md mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isSignUp ? 'Sign Up' : 'Log In'}
      </h1>
      <form onSubmit={handleAuth} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}
        <button
          type="submit"
         className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 transition-colors"
        >
          {isSignUp ? 'Sign Up' : 'Log In'}
        </button>
      </form>
<button
  onClick={() => setIsSignUp(!isSignUp)}
  className="text-sm text-blue-500 mt-4 block"
>
  {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
</button>

{!isSignUp && (
  <button
    onClick={handleForgotPassword}
    className="text-sm text-gray-500 mt-2 block"
  >
    Forgot password?
  </button>
)}
    </div>
  )
}