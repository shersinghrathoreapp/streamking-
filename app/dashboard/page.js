'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else setUser(data.user)
    })
  }, [])

  return (
    <div style={{background: 'black', minHeight: '100vh', color: 'white', padding: 40}}>
      <h1>Dashboard</h1>
      <p>Welcome {user?.email}</p>
      <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} style={{padding: 10, background: 'red', color: 'white', border: 'none', borderRadius: 6, marginTop: 20}}>Logout</button>
    </div>
  )
}
