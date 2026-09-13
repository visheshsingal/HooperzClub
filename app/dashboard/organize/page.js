'use client';

import { useMemo, useState } from 'react';
import { useDashboard } from '../dashboard-context';
import {
  PageHeader,
  Card,
  Button,
  Input,
  Select,
  Textarea,
  Badge,
  Toast,
  SectionTitle,
} from '../../../components/dashboard/ui';

const formats = ['Knockout', 'League', 'Round Robin', 'Group + Knockout'];

export default function OrganizePage() {
  const { registeredTeams, addEvent, generateFixtures } = useDashboard();
  const [step, setStep] = useState(1);
  const [createData, setCreateData] = useState({
    name: '',
    sport: 'Football',
    fixtureType: 'Knockout',
    fixtureTitle: '',
    teamCount: 8,
    start: '',
    location: '',
    fee: 0,
    description: '',
  });
  const [fixtures, setFixtures] = useState([]);
  const [toast, setToast] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const upcomingTeams = useMemo(() => registeredTeams.map((team) => team.name), [registeredTeams]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(''), 4000);
  };

  const handleCreateChange = (event) => {
    const { name, value } = event.target;
    setCreateData((prev) => ({
      ...prev,
      [name]: name === 'teamCount' || name === 'fee' ? Number(value) : value,
    }));
  };

  const handleGenerateFixtures = () => {
    const generated = generateFixtures(null, createData.fixtureType, createData.teamCount, upcomingTeams);
    setFixtures(generated);
    setStep(2);
  };

  const handleCreateTournament = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const generatedFixtures = fixtures.length
      ? fixtures
      : generateFixtures(null, createData.fixtureType, createData.teamCount, upcomingTeams);

    const newEvent = {
      id: `t-${Date.now()}`,
      name: createData.name,
      sport: createData.sport,
      type: 'Tournament',
      teams: createData.teamCount,
      start: createData.start,
      location: createData.location,
      fee: createData.fee,
      description: createData.description,
      fixtureType: createData.fixtureType,
      fixtureTitle: createData.fixtureTitle,
      fixtures: generatedFixtures,
    };

    try {
      await addEvent(newEvent);
      showToast(`"${newEvent.name}" published successfully!`);
      setCreateData({
        name: '',
        sport: 'Football',
        fixtureType: 'Knockout',
        fixtureTitle: '',
        teamCount: 8,
        start: '',
        location: '',
        fee: 0,
        description: '',
      });
      setFixtures([]);
      setStep(1);
    } catch (error) {
      showToast(error.message || 'Failed to publish event.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        label="Step 3"
        title="Organize a tournament"
        description="Create events and auto-generate match fixtures — completely free."
      />

      <div className="flex items-center gap-2">
        {[1, 2].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(s)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              step === s
                ? 'bg-red-600 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:text-black'
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-xs">
              {s}
            </span>
            {s === 1 ? 'Event details' : 'Fixtures & publish'}
          </button>
        ))}
      </div>

      {step === 1 && (
        <Card glow>
          <SectionTitle title="Event details" />
          <form
            className="mt-6 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerateFixtures();
            }}
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <Input
                label="Tournament name"
                name="name"
                value={createData.name}
                onChange={handleCreateChange}
                placeholder="Summer League 2026"
                required
              />
              <Select label="Sport" name="sport" value={createData.sport} onChange={handleCreateChange}>
                <option>Football</option>
                <option>Basketball</option>
                <option>Badminton</option>
              </Select>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <Select
                label="Fixture format"
                name="fixtureType"
                value={createData.fixtureType}
                onChange={handleCreateChange}
              >
                {formats.map((format) => (
                  <option key={format}>{format}</option>
                ))}
              </Select>
              <Input
                label="Fixture title"
                name="fixtureTitle"
                value={createData.fixtureTitle}
                onChange={handleCreateChange}
                placeholder="Quarterfinal Draw"
              />
              <Input
                label="Team count"
                name="teamCount"
                type="number"
                min="2"
                value={createData.teamCount}
                onChange={handleCreateChange}
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Input
                label="Location"
                name="location"
                value={createData.location}
                onChange={handleCreateChange}
                placeholder="Mumbai, India"
                required
              />
              <Input
                label="Start date"
                name="start"
                type="date"
                value={createData.start}
                onChange={handleCreateChange}
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <Input
                label="Registration fee (₹)"
                name="fee"
                type="number"
                min="0"
                value={createData.fee}
                onChange={handleCreateChange}
              />
              <div className="flex items-end">
                <p className="text-xs text-zinc-500">Set to 0 for free events</p>
              </div>
            </div>

            <Textarea
              label="Description"
              name="description"
              rows={3}
              value={createData.description}
              onChange={handleCreateChange}
              placeholder="Tell players about your tournament..."
            />

            <Button type="submit" variant="primary">
              Next: Generate fixtures →
            </Button>
          </form>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between">
              <SectionTitle title="Fixture preview" />
              <Badge variant="red">{createData.fixtureType}</Badge>
            </div>

            <div className="mt-6 space-y-2">
              {fixtures.length === 0 ? (
                <p className="text-sm text-zinc-500">No fixtures generated yet.</p>
              ) : (
                fixtures.map((fixture, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
                  >
                    {fixture}
                  </div>
                ))
              )}
            </div>

            {upcomingTeams.length > 0 && (
              <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Using your squads
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {upcomingTeams.map((team) => (
                    <Badge key={team}>{team}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => setStep(1)}>
                ← Back
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateTournament}
                disabled={submitting}
              >
                {submitting ? 'Publishing…' : 'Publish event for free'}
              </Button>
            </div>
          </Card>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-sm font-semibold text-black">Event summary</p>
            <div className="mt-3 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2">
              <span>Name: {createData.name}</span>
              <span>Sport: {createData.sport}</span>
              <span>Location: {createData.location}</span>
              <span>Teams: {createData.teamCount}</span>
              <span>Fee: {createData.fee > 0 ? `₹${createData.fee}` : 'Free'}</span>
              <span>Date: {createData.start || 'TBD'}</span>
            </div>
          </div>
        </div>
      )}

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
