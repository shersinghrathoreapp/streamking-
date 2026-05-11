"use client";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://jjrecklhiknejrdjjfev.supabase.co',
  'sb_publishable_fDouKSuUu6Wq84YkKhOFFA_3o48VdAP'
)

export default function Admin() {
  const [pass, setPass] = useState("");
  const [logged, setLogged] = useState(false);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  useEffect(() => {
    if (logged) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [logged]);

  const updateStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders();
  };

  if (!logged) {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl mb-4 text-center">Admin Login</h1>
          <input type="password" className="w-full p-3 mb-3 rounded bg-gray-900" placeholder="Password" onChange={e => setPass(e.target.value)} />
          <button onClick={() => pass === "admin123"? setLogged(true) : alert("Wrong")} className="w-full bg-blue-600 p-3 rounded">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl mb-4 font-bold">Orders</h1>
      {orders.length === 0 && <p>No orders yet</p>}
      {orders.map(o => (
        <div key={o.id} className="bg-gray-900 p-3 mb-2 rounded">
          <p className="font-bold">₹{o.price} - {o.plan_name}</p>
          <p>Phone: {o.phone}</p>
          <p>UTR: {o.utr}</p>
          <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleString()}</p>
          <p>Status: <span className={o.status === 'pending'? 'text-yellow-400' : o.status === 'done'? 'text-green-400' : 'text-red-400'}>{o.status}</span></p>
          {o.status === 'pending' && (
            <div className="flex gap-2 mt-2">
              <button onClick={() => updateStatus(o.id, 'done')} className="bg-green-600 px-2 py-1 rounded text-sm">Done</button>
              <button onClick={() => updateStatus(o.id, 'rejected')} className="bg-red-600 px-2 py-1 rounded text-sm">Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
