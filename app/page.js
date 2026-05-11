"use client";
import { useState } from "react";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://jjrecklhiknejrdjjfev.supabase.co',
  'sb_publishable_fDouKSuUu6Wq84YkKhOFFA_3o48VdAP'
)

export default function Home() {
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState(null);
  const [utr, setUtr] = useState("");
  const [loading, setLoading] = useState(false);

  const plans = [
    { id: 1, price: 499, mins: 30, name: "30 Min Live" },
    { id: 2, price: 999, mins: 70, name: "70 Min Live" },
    { id: 3, price: 1499, mins: 110, name: "110 Min Live" }
  ];

  const placeOrder = async () => {
    if (!phone ||!selected || utr.length < 8) {
      alert("Phone, Plan aur UTR bharo");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('orders').insert({
      phone: phone,
      plan_name: selected.name,
      price: selected.price,
      utr: utr
    });
    setLoading(false);
    if (error) alert("Error: " + error.message);
    else {
      alert("Order submit ho gaya!");
      setPhone(""); setUtr(""); setSelected(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">🔥 Stream King</h1>
      <input className="w-full p-3 mb-4 rounded bg-gray-900 border border-gray-700" placeholder="WhatsApp Number" value={phone} onChange={e => setPhone(e.target.value)} />
      <div className="grid grid-cols-1 gap-3 mb-4">
        {plans.map(p => (
          <button key={p.id} onClick={() => setSelected(p)} className={`p-4 rounded border-2 ${selected?.id === p.id? 'border-green-500 bg-green-900' : 'border-gray-700 bg-gray-900'}`}>
            <div className="text-xl font-bold">₹{p.price}</div>
            <div className="text-sm">{p.mins} Min Live</div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="bg-gray-900 p-4 rounded mb-4 border border-gray-700">
          <p className="mb-2 text-center">Pay ₹{selected.price} on UPI:</p>
          <p className="text-center font-bold text-lg mb-3">yourupi@paytm</p>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=yourupi@paytm&am=${selected.price}&tn=StreamKing`} className="mx-auto mb-3 bg-white p-2 rounded" />
          <input className="w-full p-3 rounded bg-black border border-gray-700" placeholder="UTR Number" value={utr} onChange={e => setUtr(e.target.value)} />
          <button onClick={placeOrder} disabled={loading} className="w-full mt-3 bg-green-600 p-3 rounded font-bold disabled:bg-gray-600">
            {loading? "Submitting..." : "Order Submit Karo"}
          </button>
        </div>
      )}
      <a href="/admin" className="block text-center text-blue-400 mt-6">Admin Login</a>
    </div>
  );
}
