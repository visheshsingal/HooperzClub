'use client';

import { useEffect, useState } from 'react';

export default function EventPayment({ event, team, onSuccess, onError }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const createRazorpayOrder = async (amount) => {
    const response = await fetch('/api/payment/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency: 'INR' }),
    });
    return response.json();
  };

  const openRazorpayCheckout = async () => {
    setError('');
    setProcessing(true);
    try {
      const orderData = await createRazorpayOrder(event.fee);
      if (orderData.error) throw new Error(orderData.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Hooperzclub',
        description: `Registration fee for ${event.name}`,
        order_id: orderData.id,
        handler: async function (response) {
          const verifyRes = await fetch('/api/payment/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              eventId: event.id,
              teamId: team._id,
              teamName: team.name,
              teamSport: team.sport,
            }),
          });
          const verifyBody = await verifyRes.json();
          if (!verifyRes.ok) {
            throw new Error(verifyBody.error || 'Payment verification failed');
          }
          onSuccess(verifyBody);
        },
        prefill: {
          name: team.name,
        },
        theme: {
          color: '#7f2b2b',
        },
      };

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      script.onerror = () => {
        throw new Error('Unable to load Razorpay checkout.');
      };
      document.body.appendChild(script);
    } catch (err) {
      setError(err.message || 'Unable to complete payment.');
      onError(err);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-[#0f0f0f] p-4">
      <p className="text-sm text-slate-300">This event requires a registration fee of ₹{event.fee}.</p>
      <button
        type="button"
        onClick={openRazorpayCheckout}
        disabled={processing}
        className="rounded-full bg-[#7f2b2b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#8e2a2a] disabled:cursor-not-allowed disabled:bg-slate-600"
      >
        {processing ? 'Processing…' : 'Pay with Razorpay'}
      </button>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
