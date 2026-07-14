'use client';

import { useEffect, useState } from 'react';
import { useDashboard } from '../dashboard-context';
import { PageHeader, Card, Button, Input, Select, Textarea, Toast } from '../../../components/dashboard/ui';
import LocationAutocomplete from '../../../components/dashboard/LocationAutocomplete';

export default function ProfilePage() {
  const { currentUser, updateCurrentUser } = useDashboard();
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    location: currentUser?.profile?.location || '',
    sport: currentUser?.profile?.sport || 'Football',
    bio: currentUser?.profile?.bio || '',
    whatsapp: currentUser?.profile?.whatsapp || '',
    instagram: currentUser?.profile?.instagram || '',
    telegram: currentUser?.profile?.telegram || '',
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setForm({
      name: currentUser?.name || '',
      location: currentUser?.profile?.location || '',
      sport: currentUser?.profile?.sport || 'Football',
      bio: currentUser?.profile?.bio || '',
      whatsapp: currentUser?.profile?.whatsapp || '',
      instagram: currentUser?.profile?.instagram || '',
      telegram: currentUser?.profile?.telegram || '',
    });
  }, [currentUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/dashboard/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          profile: {
            location: form.location,
            sport: form.sport,
            bio: form.bio,
            whatsapp: form.whatsapp,
            instagram: form.instagram,
            telegram: form.telegram,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save profile.');

      updateCurrentUser({
        name: form.name,
        profileCompleted: true,
        profile: {
          location: form.location,
          sport: form.sport,
          bio: form.bio,
          whatsapp: form.whatsapp,
          instagram: form.instagram,
          telegram: form.telegram,
        },
      });

      setToast('Profile updated successfully.');
    } catch (error) {
      setToast(error.message || 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        label="Step 1"
        title="Create your profile"
        description="Add your location, sport, and contact links so other players can find you and connect easily."
      />

      <Card>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Display name" name="name" value={form.name} onChange={handleChange} required />
            <Select label="Sport" name="sport" value={form.sport} onChange={handleChange}>
              <option>Football</option>
              <option>Basketball</option>
              <option>Badminton</option>
            </Select>
          </div>

          <LocationAutocomplete
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Mumbai, India"
          />

          <Textarea
            label="Short bio"
            name="bio"
            rows={3}
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell others what you play, your level, and what you are looking for."
          />

          <div className="rounded-2xl border border-white/10 bg-[#080809] p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">Connect links</h3>
            <p className="mt-2 text-sm text-zinc-500">Add any links you want others to use to reach you.</p>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <Input label="WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="https://wa.me/..." />
              <Input label="Instagram" name="instagram" value={form.instagram} onChange={handleChange} placeholder="https://instagram.com/..." />
              <Input label="Telegram" name="telegram" value={form.telegram} onChange={handleChange} placeholder="https://t.me/..." />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save profile'}
            </Button>
            <Button href="/dashboard/connect" variant="secondary">
              Go to connect
            </Button>
          </div>
        </form>
      </Card>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
