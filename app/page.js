'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [utr, setUtr] = useState('')
  const [showQR, setShowQR] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [upiId, setUpiId] = useState('yourupi@paytm')
  const [myOrders, setMyOrders] = useState([])
  const [chatMsg, setChatMsg] = useState('')
  const [chats, setChats] = useState([])

  const plans = [
    { name: 'Basic Plan', price: 499, duration: '30 Day Live', gst: 'GST Included' },
    { name: 'Standard Plan', price: 999, duration: '70 Day Live', gst: 'GST Included' },
    { name: 'Premium Plan', price: 1499, duration: '110 Day Live', gst: 'GST Included' },
  ]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user?? null)
      if(session?.user) loadOrders(session.user.email)
    })
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const { data } = await supabase.from('settings').select('*').single()
    if(data) setUpiId(data.upi_id)
  }

  const loadOrders = async (userEmail) => {
    const { data } = await supabase.from('orders').select('*').eq('user_email', userEmail).order('created_at', { ascending: false })
    if(data) setMyOrders(data)
    loadChats(userEmail)
  }

  const loadChats = async (userEmail) => {
    const { data } = await supabase.from('chats').select('*').eq('user_email', userEmail).order('created_at')
    if(data) setChats(data)
  }

  const handleAuth = async () => {
    if (!email ||!password) return alert('Email aur Password dalo')
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
      else window.location.reload()
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) alert(error.message)
      else alert('Account ban gaya! Ab Login karo')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const handleSubmit = async () => {
    if (!selectedPlan ||!utr) return alert('Plan select karo aur UTR dalo')
    const { error } = await supabase.from('orders').insert([
      { user_email: user.email, plan_name: selectedPlan.name, price: selectedPlan.price, utr, status: 'pending' }
    ])
    if (error) alert('Error: ' + error.message)
    else {
      alert('Order Submit Ho Gaya! Admin confirm karega.')
      setSelectedPlan(null)
      setUtr('')
      setShowQR(false)
      loadOrders(user.email)
    }
  }

  const sendChat = async () => {
    if(!chatMsg) return
    await supabase.from('chats').insert([{ user_email: user.email, message: chatMsg, sender: 'user' }])
    setChatMsg('')
    loadChats(user.email)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-md mx-auto pt-20">
          <h1 className="text-3xl font-bold text-center mb-8">🔥 Stream King 🔥</h1>
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-center">{isLogin? 'User Login' : 'User Signup'}</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 bg-black rounded-lg border border-gray-700 text-white"/>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-4 bg-black rounded-lg border border-gray-700 text-white"/>
            <button onClick={handleAuth} className="w-full bg-blue-600 p-3 rounded-lg font-bold hover:bg-blue-700 mb-4">{isLogin? 'Login' : 'Signup'}</button>
            <p className="text-center text-sm text-gray-400">
              {isLogin? 'Account nahi hai? ' : 'Account hai? '}
              <button onClick={() => setIsLogin(!isLogin)} className="text-blue-400 underline">{isLogin? 'Signup karo' : 'Login karo'}</button>
            </p>
          </div>
          <div className="text-center mt-8"><a href="/admin" className="text-sm text-gray-500">Admin Login</a></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto pt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">🔥 Stream King 🔥</h1>
          <button onClick={handleLogout} className="text-sm text-red-400">Logout</button>
        </div>
        {myOrders.filter(o => o.status === 'active').map(order => (
          <div key={order.id} className="bg-green-900/30 border border-green-500 p-4 rounded-lg mb-4">
            <div className="font-bold text-green-400">✅ {order.plan_name} ACTIVE</div>
            <div className="text-sm mt-2">Live Link: <a href={order.live_link} target="_blank" className="text-blue-400 underline">{order.live_link}</a></div>
            <div className="text-sm">Stream Key: <span className="text-yellow-400">{order.live_key}</span></div>
          </div>
        ))}
        <div className="space-y-4 mb-6">
          {plans.map((plan) => (
            <button key={plan.name} onClick={() => { setSelectedPlan(plan); setShowQR(true) }}
              className={`w-full p-4 rounded-lg border-2 ${selectedPlan?.name === plan.name? 'border-blue-500 bg-blue-500/20' : 'border-gray-700 bg-gray-900'}`}>
              <div className="text-2xl font-bold">₹{plan.price}</div>
              <div className="text-sm text-gray-400">{plan.duration}</div>
              <div className="text-xs text-green-400">{plan.gst}</div>
            </button>
          ))}
        </div>
        {showQR && selectedPlan && (
          <div className="bg-gray-900 p-6 rounded-lg text-center mb-6">
            <p className="mb-2 text-lg">Amount: <span className="text-green-400 font-bold">₹{selectedPlan.price}</span></p>
            <p className="mb-2">UPI ID: <span className="text-blue-400 font-bold">{upiId}</span></p>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=StreamKing&am=${selectedPlan.price}`} alt="QR" className="mx-auto mb-4 bg-white p-2 rounded"/>
            <input type="text" placeholder="UTR / Transaction ID" value={utr} onChange={(e) => setUtr(e.target.value)} className="w-full p-3 mb-4 bg-black rounded-lg border border-gray-700 text-white"/>
            <button onClick={handleSubmit} className="w-full bg-blue-600 p-3 rounded-lg font-bold hover:bg-blue-700">Submit Order</button>
          </div>
        )}
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="font-bold mb-3">Admin Support Chat</h3>
          <div className="h-40 overflow-y-auto mb-3 bg-black p-2 rounded">
            {chats.map(c => (
              <div key={c.id} className={`mb-2 ${c.sender === 'admin'? 'text-green-400' : 'text-blue-400'}`}>
                <b>{c.sender}:</b> {c.message}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={chatMsg} onChange={(e) => setChatMsg(e.target.value)} placeholder="Message likho..." className="flex-1 p-2 bg-black rounded border border-gray-700"/>
            <button onClick={sendChat} className="bg-blue-600 px-4 rounded">Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}
