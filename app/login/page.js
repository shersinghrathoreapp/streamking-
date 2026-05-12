'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabaseUrl = 'https://TUMHARA-PROJECT-URL.supabase.co'
const supabaseAnonKey = 'TUMHARA-ANON-KEY-YAHAN'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleAuth = async () => {
    setLoading(true)
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) alert(error.message)
      else alert('Account ban gaya! Ab login karo')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">StreamKing 👑</h1>
        <h2 className="text-xl mb-4 text-center">{isSignUp ? 'Account Banao' : 'Login Karo'}</h2>
        
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full bg-gray-800 p-3 rounded mb-3 text-white border border-gray-700"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full bg-gray-800 p-3 rounded mb-4 text-white border border-gray-700"
        />
        
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-purple-600 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 font-bold mb-3"
        >
          {loading ? 'Wait...' : isSignUp ? 'Sign Up' : 'Login'}
        </button>
        
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-gray-400 text-sm hover:text-white"
        >
          {isSignUp ? 'Pehle se account hai? Login' : 'Naya hai? Sign Up'}
        </button>
      </div>
    </div>
  )
}
