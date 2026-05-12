'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push('/dashboard')
    })
  }, [])

  return (
    <div style={{background: 'black', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <h1 style={{fontSize: 48, marginBottom: 20}}>StreamKing Live 🔴</h1>
      <p style={{marginBottom: 40}}>YouTube 24x7 Live Stream Service</p>
      <div style={{display: 'flex', gap: 20}}>
        <button onClick={() => router.push('/login')} style={{padding: '12px 24px', background: 'white', color: 'black', border: 'none', borderRadius: 8, cursor: 'pointer'}}>Login</button>
        <button onClick={() => router.push('/signup')} style={{padding: '12px 24px', background: 'red', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer'}}>Signup</button>
      </div>
      <br/>
      <a href="/admin" style={{marginTop: 40, color: 'gray'}}>Admin Panel</a>
    </div>
  )
}
