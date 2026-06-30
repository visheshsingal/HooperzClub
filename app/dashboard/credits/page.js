'use client';

import { useState, useEffect } from 'react';
import { useDashboard } from '../dashboard-context';

async function createRazorpayOrder(amount) {
  const response = await fetch('/api/payment/razorpay/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  return response.json();
}

export default function CreditsPage() {
  const { currentUser, buyCredits } = useDashboard();
  const [amount, setAmount] = useState(10);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
    }
  }, []);

  const handleBuy = async (event) => {
    event.preventDefault();
    setStatus('');
    setIsLoading(true);

    try {
      const totalAmount = Number(amount) * 99;
      const order = await createRazorpayOrder(totalAmount);
      if (order.error) {
        throw new Error(order.error);
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Hooperzclub',
        description: `Buy ${amount} credits for ₹${totalAmount}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            await buyCredits(Number(amount));
            setStatus(`Purchased ${amount} credits. New balance updated.`);
          } catch (buyError) {
            setStatus(buyError.message || 'Payment succeeded but credit update failed.');
          }
        },
        theme: {
          color: '#7f2b2b',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setStatus(error.message || 'Unable to complete purchase.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-white/10 bg-[#181818] p-8 shadow-2xl shadow-black/20">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Credits</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Buy credits to organize events</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">Each event costs 1 credit to publish. Purchase more credits here and continue organizing without interruption.</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[#141414] p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Current balance</p>
            <p className="mt-4 text-5xl font-semibold text-white">{currentUser?.credits ?? 0}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#141414] p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Buy credits</p>
            <form onSubmit={handleBuy} className="mt-6 space-y-4">
              <label className="space-y-2 text-sm text-slate-300">
                Number of credits
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
                />
              </label>
              <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-[#7f2b2b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8e2a2a]">
                Buy credits
              </button>
            </form>
            {status ? <p className="mt-4 text-sm text-slate-300">{status}</p> : null}
          </div>
        </div>
      </section>
    </div>
  );
}
