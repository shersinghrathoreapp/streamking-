'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  return (
    <div style={{padding: 40, textAlign: 'center'}}>
      <h1>StreamKing Live 🔴</h1>
      <p>Site Successfully Deployed ✅</p>
      <br/>
      <a href="/admin" style={{background: 'black', color: 'white', padding: '10px 20px', borderRadius: 8}}>
        Admin Panel
      </a>
    </div>
  )
}
