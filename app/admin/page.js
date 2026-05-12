'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const ADMIN_PASSWORD = "admin123"

export default function AdminPanel() {
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [upiId, setUpiId] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [orders, setOrders] = useState([])
  const [plans, setPlans] = useState([])
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('orders')

  useEffect(() => {
    if (loggedIn) {
      loadData()
    }
  }, [loggedIn])

  async function loadData() {
    const { data: settings } = await supabase.from('settings').select('*').single()
    setUpiId(settings?.upi_id || '')
    setQrUrl(settings?.qr_url || '')

    const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(ordersData || [])

    const { data: plansData } = await supabase.from('plans').select('*')
    setPlans(plansData || [])

    const { data: usersData } = await supabase.from('users').select('*')
    setUsers(usersData || [])
  }

  async function updateUPI() {
    await supabase.from('settings').upsert({ id: 1, upi_id: upiId, qr_url: qrUrl })
    alert('UPI + QR Updated')
  }

  async function uploadQR(e) {
    const file = e.target.files[0]
    const { data } = await supabase.storage.from('qr').upload(`qr-${Date.now()}.png`, file)
    const { data: url } = supabase.storage.from('qr').getPublicUrl(data.path)
    setQrUrl(url.publicUrl)
  }

  async function approveOrder(id, user_id, plan_id) {
    await supabase.from('orders').update({ status: 'approved' }).eq('id', id)
    await supabase.from('users').update({ plan_id, status: 'active', expires_at: new Date(Date.now() + 30*24*60*60*1000) }).eq('id', user_id)
    loadData()
  }

  async function rejectOrder(id) {
    await supabase.from('orders').update({ status: 'rejected' }).eq('id', id)
    loadData()
  }

  async function addPlan() {
    const name = prompt('Plan Name:')
    const price = prompt('Price:')
    const duration = prompt('Duration days:')
    await supabase.from('plans').insert({ name, price, duration_days: duration })
    loadData()
  }

  async function deletePlan(id) {
    await supabase.from('plans').delete().eq('id', id)
    loadData()
  }

  if (!loggedIn) {
    return (
      <div style={{background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{background: '#1a1a1a', padding: 40, borderRadius: 12}}>
          <h2 style={{color: 'white', marginBottom: 20}}>Admin Login</h2>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{padding: 10, width: 250, marginBottom: 10, background: '#2a2a2a', border: 'none', color: 'white', borderRadius: 6}} />
          <br/>
          <button onClick={() => setLoggedIn(password === ADMIN_PASSWORD)} style={{padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', width: '100%'}}>Login</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{background: '#0a0a0a', minHeight: '100vh', color: 'white', padding: 20}}>
      <h1 style={{marginBottom: 20}}>Admin Panel - StreamKing</h1>

      <div style={{display: 'flex', gap: 10, marginBottom: 20}}>
        <button onClick={() => setTab('orders')} style={{padding: '10px 20px', background: tab==='orders'?'#3b82f6':'#2a2a2a', border: 'none', color: 'white', borderRadius: 6, cursor: 'pointer'}}>Orders</button>
        <button onClick={() => setTab('plans')} style={{padding: '10px 20px', background: tab==='plans'?'#3b82f6':'#2a2a2a', border: 'none', color: 'white', borderRadius: 6, cursor: 'pointer'}}>Plans</button>
        <button onClick={() => setTab('users')} style={{padding: '10px 20px', background: tab==='users'?'#3b82f6':'#2a2a2a', border: 'none', color: 'white', borderRadius: 6, cursor: 'pointer'}}>Users</button>
        <button onClick={() => setTab('settings')} style={{padding: '10px 20px', background: tab==='settings'?'#3b82f6':'#2a2a2a', border: 'none', color: 'white', borderRadius: 6, cursor: 'pointer'}}>Settings</button>
      </div>

      {tab === 'settings' && (
        <div style={{background: '#1a1a1a', padding: 20, borderRadius: 12}}>
          <h3>UPI Settings</h3>
          <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="UPI ID" style={{padding: 10, width: 300, marginBottom: 10, background: '#2a2a2a', border: 'none', color: 'white', borderRadius: 6}} />
          <br/>
          <h3>QR Code Upload</h3>
          <input type="file" onChange={uploadQR} style={{marginBottom: 10}} />
          {qrUrl && <img src={qrUrl} style={{width: 200, display: 'block', marginBottom: 10}} />}
          <br/>
          <button onClick={updateUPI} style={{padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer'}}>Update UPI + QR</button>
        </div>
      )}

      {tab === 'orders' && (
        <div style={{background: '#1a1a1a', padding: 20, borderRadius: 12}}>
          <h3>Orders</h3>
          <table style={{width: '100%', textAlign: 'left'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #333'}}>
                <th style={{padding: 10}}>Email</th>
                <th>Plan</th>
                <th>Price</th>
                <th>UTR</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} style={{borderBottom: '1px solid #333'}}>
                  <td style={{padding: 10}}>{o.email}</td>
                  <td>{o.plan_name}</td>
                  <td>₹{o.price}</td>
                  <td>{o.utr}</td>
                  <td>{o.status}</td>
                  <td>
                    {o.status === 'pending' && (
                      <>
                        <button onClick={() => approveOrder(o.id, o.user_id, o.plan_id)} style={{padding: '5px 10px', background: 'green', color: 'white', border: 'none', borderRadius: 4, marginRight: 5, cursor: 'pointer'}}>Approve</button>
                        <button onClick={() => rejectOrder(o.id)} style={{padding: '5px 10px', background: 'red', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer'}}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'plans' && (
        <div style={{background: '#1a1a1a', padding: 20, borderRadius: 12}}>
          <h3>Plans</h3>
          <button onClick={addPlan} style={{padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', marginBottom: 20}}>Add Plan</button>
          {plans.map(p => (
            <div key={p.id} style={{background: '#2a2a2a', padding: 15, marginBottom: 10, borderRadius: 8, display: 'flex', justifyContent: 'space-between'}}>
              <div>
                <b>{p.name}</b> - ₹{p.price} - {p.duration_days} days
              </div>
              <button onClick={() => deletePlan(p.id)} style={{padding: '5px 10px', background: 'red', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer'}}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div style={{background: '#1a1a1a', padding: 20, borderRadius: 12}}>
          <h3>Users</h3>
          <table style={{width: '100%', textAlign: 'left'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #333'}}>
                <th style={{padding: 10}}>Email</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{borderBottom: '1px solid #333'}}>
                  <td style={{padding: 10}}>{u.email}</td>
                  <td>{u.plan_id}</td>
                  <td>{u.status}</td>
                  <td>{u.expires_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
