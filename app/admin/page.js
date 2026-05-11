'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [isAuth, setIsAuth] = useState(false)
  const [orders, setOrders] = useState([])
  const [settings, setSettings] = useState({ upi_id: '' })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [liveLink, setLiveLink] = useState('')
  const [liveKey, setLiveKey] = useState('')
  const [chatMsg, setChatMsg] = useState('')
  const [chatUser, setChatUser] = useState('')
  const [chats, setChats] = useState([])

  useEffect(() => {
    if(isAuth) {
      loadOrders()
      loadSettings()
    }
  }, [isAuth])

  const loadOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if(data) setOrders(data)
  }

  const loadSettings = async () => {
    const { data } = await supabase.from('settings').select('*').single()
    if(data) setSettings(data)
  }

  const updateSettings = async () => {
    await supabase.from('settings').update({ upi_id: settings.upi_id }).eq('id', 1)
    alert('UPI Update Ho Gayi!')
    loadSettings()
  }

  const activateOrder = async (orderId) => {
    if(!liveLink ||!liveKey) return alert('Live Link aur Key dalo')
    const days = orders.find(o => o.id === orderId).plan_name.includes('30')? 30 :
                 orders.find(o => o.id === orderId).plan_name.includes('70')? 70 : 110
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + days)
    await supabase.from('orders').update({
      status: 'active',
      live_link: liveLink,
      live_key: liveKey,
      expires_at: expiresAt.toISOString()
    }).eq('id', orderId)
    alert('Order Activate Ho Gaya!')
    loadOrders()
    setSelectedOrder(null)
    setLiveLink('')
    setLiveKey('')
  }

  const deactivateOrder = async (orderId) => {
    await supabase.from('orders').update({ status: 'expired' }).eq('id', orderId)
    loadOrders()
  }

  const loadChats = async (userEmail) => {
    setChatUser(userEmail)
    const { data } = await supabase.from('chats').select('*').eq('user_email', userEmail).order('created_at')
    if(data) setChats(data)
  }

  const sendChat = async () => {
    if(!chatMsg ||!chatUser) return
    await supabase.from('chats').insert([{ user_email: chatUser, message: chatMsg, sender: 'admin' }])
    setChatMsg('')
    loadChats(chatUser)
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg w-80">
          <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-black rounded-lg border border-gray-700"/>
          <button onClick={() => password === 'admin123'? setIsAuth(true) : alert('Galat Password')}
            className="w-full bg-blue-600 p-3 rounded-lg font-bold">Login</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        <div className="bg-gray-900 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-3">UPI Settings</h2>
          <div className="flex gap-2">
            <input value={settings.upi_id} onChange={(e) => setSettings({...settings, upi_id: e.target.value})}
              className="flex-1 p-2 bg-black rounded border border-gray-700" placeholder="UPI ID"/>
            <button onClick={updateSettings} className="bg-blue-600 px-4 rounded">Update UPI</button>
          </div>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-3">Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-700">
                <th className="p-2 text-left">Email</th><th>Plan</th><th>Price</th><th>UTR</th><th>Status</th><th>Action</th>
              </tr></thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-gray-800">
                    <td className="p-2">{order.user_email}</td>
                    <td>{order.plan_name}</td>
                    <td className="text-green-400">₹{order.price}</td>
                    <td>{order.utr}</td>
                    <td><span className={`px-2 py-1 rounded text-xs ${order.status === 'active'? 'bg-green-600' : order.status === 'pending'? 'bg-yellow-600' : 'bg-red-600'}`}>{order.status}</span></td>
                    <td className="space-x-2">
                      {order.status === 'pending' && <button onClick={() => setSelectedOrder(order)} className="bg-green-600 px-2 py-1 rounded text-xs">Activate</button>}
                      {order.status === 'active' && <button onClick={() => deactivateOrder(order.id)} className="bg-red-600 px-2 py-1 rounded text-xs">Deactivate</button>}
                      <button onClick={() => loadChats(order.user_email)} className="bg-blue-600 px-2 py-1 rounded text-xs">Chat</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-lg w-96">
              <h3 className="text-xl font-bold mb-4">Activate: {selectedOrder.user_email}</h3>
              <input value={liveLink} onChange={(e) => setLiveLink(e.target.value)} placeholder="YouTube Live Link" className="w-full p-2 mb-3 bg-black rounded border border-gray-700"/>
              <input value={liveKey} onChange={(e) => setLiveKey(e.target.value)} placeholder="Stream Key" className="w-full p-2 mb-3 bg-black rounded border border-gray-700"/>
              <div className="flex gap-2">
                <button onClick={() => activateOrder(selectedOrder.id)} className="flex-1 bg-green-600 p-2 rounded">Activate</button>
                <button onClick={() => setSelectedOrder(null)} className="flex-1 bg-gray-600 p-2 rounded">Cancel</button>
              </div>
            </div>
          </div>
        )}
        {chatUser && (
          <div className="bg-gray-900 p-4 rounded-lg">
            <h3 className="font-bold mb-3">Chat with: {chatUser}</h3>
            <div className="h-40 overflow-y-auto mb-3 bg-black p-2 rounded">
              {chats.map(c => (
                <div key={c.id} className={`mb-2 ${c.sender === 'admin'? 'text-green-400' : 'text-blue-400'}`}>
                  <b>{c.sender}:</b> {c.message}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} placeholder="Message..." className="flex-1 p-2 bg-black rounded border border-gray-700"/>
              <button onClick={sendChat} className="bg-blue-600 px-4 rounded">Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
