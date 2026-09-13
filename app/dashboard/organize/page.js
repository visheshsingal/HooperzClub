'use client';

import Link from 'next/link';
import { PageHeader, Card, Button } from '../../../components/dashboard/ui';

export default function OrganizePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Basketball Events"
        description="All official Basketball tournaments and pickup matches are published by Hooperzclub Admins."
      />

      <Card className="text-center py-12 px-6 max-w-2xl mx-auto space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl font-bold">
          🏀
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-black">Events are Managed by Admins</h2>
          <p className="text-sm text-zinc-600 leading-relaxed max-w-md mx-auto">
            Basketball tournaments, 1v1 isolations, 3v3 streetball, and 5v5 leagues are hosted through the official Admin panel.
            Head over to the Events page to browse upcoming matches and register your squad!
          </p>
        </div>

        <div>
          <Link href="/dashboard/events">
            <Button variant="primary" size="lg">
              Browse & Register for Events →
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
