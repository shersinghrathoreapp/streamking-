'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else {
      alert('Signup done! Email check kar le')
      router.push('/login')
    }
  }

  return (
    <div style={{background: 'black', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>
      <div style={{background: '#1a1a1a', padding: 40, borderRadius: 12, width: 350}}>
        <h2 style={{marginBottom: 20}}>Signup - StreamKing</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{padding: 12, width: '100%', marginBottom: 10, background: '#2a2a2a', border: 'none', color: 'white', borderRadius: 6}} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{padding: 12, width: '100%', marginBottom: 20, background: '#2a2a2a', border: 'none', color: 'white', borderRadius: 6}} />
        <button onClick={handleSignup} style={{padding: 12, width: '100%', background: 'red', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer'}}>Signup</button>
        <p style={{marginTop: 20, textAlign: 'center'}}>Already have account? <a href="/login" style={{color: '#3b82f6'}}>Login</a></p>
      </div>
    </div>
  )
}
