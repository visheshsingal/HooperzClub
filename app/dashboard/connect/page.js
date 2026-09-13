'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '../dashboard-context';
import { PageHeader, Card, Button, EmptyState, Badge, Toast } from '../../../components/dashboard/ui';
import LocationAutocomplete from '../../../components/dashboard/LocationAutocomplete';

export default function ConnectPage() {
  const { currentUser } = useDashboard();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [searchLocation, setSearchLocation] = useState(currentUser?.profile?.location || '');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('/api/dashboard/connect');
        if (!response.ok) throw new Error('Unable to load people.');
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        setToast(error.message || 'Unable to load people.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const nearbyUsers = useMemo(() => {
    const query = (searchLocation || '').trim().toLowerCase();
    const otherUsers = users.filter((u) => u.userId !== currentUser?.userId);
    if (!query) return otherUsers;
    return otherUsers.filter((user) => {
      const location = (user.profile?.location || '').toLowerCase();
      return location && (location.includes(query) || query.includes(location));
    });
  }, [searchLocation, users, currentUser]);

  const openLink = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        label="Step 2"
        title="Connect with nearby players"
        description="Find players from your area, view their profile, and reach out through WhatsApp, Instagram, or Telegram."
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-black">People near you</h2>
            <p className="mt-1 text-sm text-zinc-600">
              {searchLocation ? `Showing players matching "${searchLocation}"` : 'Showing all available players'}
            </p>
          </div>
          <Link href="/dashboard/profile">
            <Button variant="secondary">Edit your profile</Button>
          </Link>
        </div>

        <div className="mt-5 max-w-md">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <LocationAutocomplete
                label="Search by location"
                placeholder="Search location (e.g. Delhi, India)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            {searchLocation && (
              <Button type="button" variant="ghost" onClick={() => setSearchLocation('')} className="h-[46px] shrink-0">
                Clear
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">
            Loading nearby players...
          </div>
        ) : nearbyUsers.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No players found"
              description="Complete your profile with a location and try again to discover nearby players."
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {nearbyUsers.map((user) => (
              <div key={user.userId} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-black">{user.name}</h3>
                    <p className="mt-1 text-sm text-zinc-600">{user.profile?.sport || 'Sport not added'}</p>
                  </div>
                  <Badge variant="red">{user.profile?.location || 'Location not added'}</Badge>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  {user.profile?.bio || 'No bio added yet.'}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {user.profile?.whatsapp && (
                    <button onClick={() => openLink(user.profile.whatsapp)} className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 transition hover:border-red-300 hover:text-black">
                      WhatsApp
                    </button>
                  )}
                  {user.profile?.instagram && (
                    <button onClick={() => openLink(user.profile.instagram)} className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 transition hover:border-red-300 hover:text-black">
                      Instagram
                    </button>
                  )}
                  {user.profile?.telegram && (
                    <button onClick={() => openLink(user.profile.telegram)} className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 transition hover:border-red-300 hover:text-black">
                      Telegram
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
