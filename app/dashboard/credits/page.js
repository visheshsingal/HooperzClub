'use client';

import { useState, useEffect } from 'react';
import { useDashboard } from '../dashboard-context';
import {
  PageHeader,
  Card,
  Button,
  Input,
  StatCard,
  Toast,
} from '../../../components/dashboard/ui';

async function createRazorpayOrder(amount) {
  const response = await fetch('/api/payment/razorpay/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  return response.json();
}

const PACKAGES = [
  { credits: 5, popular: false },
  { credits: 10, popular: true },
  { credits: 25, popular: false },
  { credits: 50, popular: false },
];

export default function CreditsPage() {
  const { currentUser, buyCredits } = useDashboard();
  const [amount, setAmount] = useState(10);
  const [toast, setToast] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
    }
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(''), 4000);
  };

  const handleBuy = async (creditAmount) => {
    setIsLoading(true);
    const credits = creditAmount || amount;

    try {
      const totalAmount = Number(credits) * 99;
      const order = await createRazorpayOrder(totalAmount);
      if (order.error) throw new Error(order.error);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Hooperz Club',
        description: `Buy ${credits} credits for ₹${totalAmount}`,
        order_id: order.id,
        handler: async function () {
          try {
            await buyCredits(Number(credits));
            showToast(`+${credits} credits added to your account!`);
          } catch (buyError) {
            showToast(buyError.message || 'Payment succeeded but credit update failed.', 'error');
          }
        },
        theme: { color: '#E50914' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      showToast(error.message || 'Unable to complete purchase.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const balance = currentUser?.credits ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        label="Credits"
        title="Power up your account"
        description="Each tournament you organize costs 1 credit. New users start with 99 credits."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Current balance"
          value={balance}
          accent={balance < 5}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          }
        />
        <StatCard
          label="Price per credit"
          value="₹99"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M9 14l6-6M9.5 8.5h.01M14.5 13.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <Card glow>
        <h2 className="text-lg font-semibold text-white">Choose a package</h2>
        <p className="mt-1 text-sm text-zinc-500">Tap to buy instantly via Razorpay</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((pkg) => (
            <button
              key={pkg.credits}
              type="button"
              disabled={isLoading}
              onClick={() => handleBuy(pkg.credits)}
              className={`relative rounded-lg border p-5 text-left transition hover:border-red-500/50 hover:bg-[#1f1f1f] disabled:opacity-50 ${
                pkg.popular
                  ? 'border-red-500/50 bg-gradient-to-b from-red-600/10 to-transparent'
                  : 'border-white/10 bg-[#181818]'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-2.5 left-4 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Popular
                </span>
              )}
              <p className="text-3xl font-bold text-white">{pkg.credits}</p>
              <p className="text-sm text-zinc-500">credits</p>
              <p className="mt-3 text-lg font-semibold text-red-500">₹{pkg.credits * 99}</p>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white">Custom amount</h2>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Number of credits"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm text-zinc-500">Total</p>
            <p className="text-2xl font-bold text-white">₹{amount * 99}</p>
          </div>
          <Button variant="primary" onClick={() => handleBuy()} disabled={isLoading}>
            {isLoading ? 'Processing…' : 'Buy now'}
          </Button>
        </div>
      </Card>

      <div className="rounded-lg border border-white/5 bg-[#181818] p-5">
        <p className="text-sm font-semibold text-white">How credits work</p>
        <ul className="mt-3 space-y-2 text-sm text-zinc-500">
          <li>• 1 credit = 1 tournament published</li>
          <li>• Joining events is free (paid events charge registration fee separately)</li>
          <li>• Credits never expire</li>
        </ul>
      </div>

      {toast && (
        <Toast
          message={typeof toast === 'string' ? toast : toast.msg}
          type={typeof toast === 'string' ? 'success' : toast.type}
          onClose={() => setToast('')}
        />
      )}
    </div>
  );
}
