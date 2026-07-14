'use client';

import { useEffect, useState } from 'react';
import { Button } from '../../../components/dashboard/ui';

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
        name: 'Hooperz Club',
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
          color: '#E50914',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
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
    <div className="rounded-lg border border-red-500/20 bg-red-600/5 p-4">
      <p className="text-sm text-zinc-300">
        Registration fee: <span className="font-bold text-white">₹{event.fee}</span> for squad{' '}
        <span className="font-semibold text-red-400">{team.name}</span>
      </p>
      <Button
        variant="primary"
        className="mt-3"
        onClick={openRazorpayCheckout}
        disabled={processing}
      >
        {processing ? 'Processing…' : `Pay ₹${event.fee} with Razorpay`}
      </Button>
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
