'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, Card } from '../../../components/dashboard/ui';

export default function CreditsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/overview');
  }, [router]);

  return (
    <div className="space-y-8">
      <PageHeader
        label="Free"
        title="Everything is free"
        description="There are no credits or paid upgrades. All events and tournament creation are included for everyone."
      />

      <Card>
        <p className="text-sm text-zinc-600">
          You are being redirected to your dashboard home. Use the main navigation to create squads, join events, and organize tournaments without any payment flow.
        </p>
      </Card>
    </div>
  );
}
