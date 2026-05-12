'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [plans, setPlans] = useState([])
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [utr, setUtr] = useState('')
  const [youtubeLink, setYoutubeLink] = useState('')
  const [streamKey, setStreamKey] = useState('')
  const [chatMsg, setChatMsg] = useState('')
  const [messages, setMessages] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // QR Code - Apna QR image ka link yahan daal dena
  const QR_IMAGE = 'https://via.placeholder.com/200x200.png?text=Scan+To+Pay'

  useEffect(() => {
    getUser()
    getPlans()
  }, [])

  useEffect(() => {
    if (user) {
      getStreamData()
      getMessages()
      getPayments()
    }
  }, [user])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/login')
    else setUser(user)
  }

  const getPlans = async () => {
    const { data, error } = await supabase.from('plans').select('*').order('price')
    if (error) console.log(error)
    else setPlans(data || [])
  }

  const getStreamData = async () => {
    const { data } = await supabase
     .from('user_streams')
     .select('*')
     .eq('user_id', user.id)
     .single()
    if (data) {
      setYoutubeLink(data.youtube_link || '')
      setStreamKey(data.stream_key || '')
    }
  }

  const getMessages = async () => {
    const { data } = await supabase
     .from('support_messages')
     .select('*')
     .eq('user_id', user.id)
     .order('created_at', { ascending: false })
    setMessages(data || [])
  }

  const getPayments = async () => {
    const { data } = await supabase
     .from('payments')
     .select('*, plans(*)')
     .eq('user_id', user.id)
     .order('created_at', { ascending: false })
    setPayments(data || [])
  }

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan)
    setUtr('')
  }

  const handleUtrSubmit = async () => {
    if (!utr ||!selectedPlan) return alert('UTR daal bhai')
    setLoading(true)

    const { error } = await supabase.from('payments').insert({
      user_id: user.id,
      plan_id: selectedPlan.id,
      utr: utr,
      status: 'pending'
    })

    if (error) alert('Error: ' + error.message)
    else {
      alert('UTR Submit ho gaya! Admin confirm karega 24 hours me')
      setSelectedPlan(null)
      setUtr('')
      getPayments()
    }
    setLoading(false)
  }

  const saveStreamData = async () => {
    if (!youtubeLink &&!streamKey) return alert('Kuch to daal bhai')
    setLoading(true)

    const { error } = await supabase
     .from('user_streams')
     .upsert({
        user_id: user.id,
        youtube_link: youtubeLink,
        stream_key: streamKey
      })

    if (error) alert('Error: ' + error.message)
    else alert('Stream Settings Save ho gayi!')
    setLoading(false)
  }

  const sendMessage = async () => {
    if (!chatMsg.trim()) return
    setLoading(true)

    const { error } = await supabase.from('support_messages').insert({
      user_id: user.id,
      message: chatMsg
    })

    if (error) alert('Error: ' + error.message)
    else {
      setChatMsg('')
      getMessages()
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return <div className="bg-black text-white min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold">StreamKing 👑</h1>
            <p className="text-gray-400">Welcome, {user.email}</p>
          </div>
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700">
            Logout
          </button>
        </div>

        {/* PAYMENT STATUS */}
        {payments.length > 0 && (
          <div className="mb-6 bg-gray-900 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Payment Status</h3>
            {payments[0].status === 'pending' && (
              <p className="text-yellow-400">⏳ {payments[0].plans?.name} - UTR: {payments[0].utr} - Pending Approval</p>
            )}
            {payments[0].status === 'confirmed' && (
              <p className="text-green-400">✅ {payments[0].plans?.name} - Active</p>
            )}
            {payments[0].status === 'rejected' && (
              <p className="text-red-400">❌ {payments[0].plans?.name} - Rejected</p>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">

          {/* LEFT - PLANS */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">💎 Subscription Plans</h2>

            {plans.map(plan => (
              <div
                key={plan.id}
                onClick={() => handlePlanClick(plan)}
                className="bg-gray-800 p-4 rounded-lg mb-3 cursor-pointer hover:bg-gray-700 border-2 border-transparent hover:border-purple-600 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <p className="text-gray-400 text-sm capitalize">{plan.duration} Plan</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">₹{plan.price}</p>
                    <p className="text-xs text-gray-400">+ ₹{plan.gst} GST</p>
                    <p className="text-sm text-green-400 font-bold">Total: ₹{plan.price + plan.gst}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* QR + UTR Section */}
            {selectedPlan && (
              <div className="mt-6 bg-gray-800 p-4 rounded-lg border-2 border-purple-600">
                <h3 className="font-bold mb-2 text-center">{selectedPlan.name} - ₹{selectedPlan.price + selectedPlan.gst}</h3>
                <img src={QR_IMAGE} alt="QR Code" className="mx-auto my-4 rounded w-48 h-48 bg-white p-2" />
                <p className="text-sm text-gray-400 mb-2 text-center">Scan karo aur payment ke baad UTR daalo:</p>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="UTR / Transaction ID"
                  className="w-full bg-gray-700 p-3 rounded mb-3 text-white border border-gray-600"
                />
                <button
                  onClick={handleUtrSubmit}
                  disabled={loading}
                  className="w-full bg-purple-600 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 font-bold"
                >
                  {loading? 'Submitting...' : 'Submit UTR for Approval'}
                </button>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="w-full mt-2 bg-gray-700 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* STREAM SETTINGS */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">🎥 Stream Settings</h2>

              <div className="mb-4">
                <label className="block text-sm mb-2 text-gray-400">YouTube Video Link</label>
                <input
                  type="text"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full bg-gray-800 p-3 rounded text-white border border-gray-700"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2 text-gray-400">Stream Key</label>
                <input
                  type="password"
                  value={streamKey}
                  onChange={(e) => setStreamKey(e.target.value)}
                  placeholder="Your YouTube Live Stream Key"
                  className="w-full bg-gray-800 p-3 rounded text-white border border-gray-700"
                />
              </div>

              <button
                onClick={saveStreamData}
                disabled={loading}
                className="w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-600 font-bold"
              >
                {loading? 'Saving...' : 'Save Stream Settings'}
              </button>
            </div>

            {/* SUPPORT CHAT */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">💬 Support Chat</h2>

              <div className="bg-gray-800 p-3 rounded-lg mb-4 h-56 overflow-y-auto">
                {messages.length === 0? (
                  <p className="text-gray-500 text-sm text-center mt-20">Koi problem ho to message karo</p>
                ) : messages.map(msg => (
                  <div key={msg.id} className="mb-3">
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">You:</p>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    {msg.reply && (
                      <div className="bg-green-900/50 p-3 rounded-lg mt-2 ml-4 border-l-2 border-green-500">
                        <p className="text-xs text-green-400 mb-1">Admin:</p>
                        <p className="text-sm">{msg.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  placeholder="Apni problem likho..."
                  className="flex-1 bg-gray-800 p-3 rounded-lg text-white border border-gray-700"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-600 font-bold"
                >
                  Send
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
