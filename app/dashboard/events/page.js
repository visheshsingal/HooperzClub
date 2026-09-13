'use client';

import { useState } from 'react';
import { useDashboard } from '../dashboard-context';
import {
  PageHeader,
  Card,
  Button,
  Select,
  Input,
  Badge,
  EmptyState,
  Toast,
} from '../../../components/dashboard/ui';

export default function EventsPage() {
  const {
    events,
    registeredTeams,
    joinedEvents,
    joinEvent,
    deleteEvent,
    discardJoin,
    currentUser,
  } = useDashboard();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [toast, setToast] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(''), 3500);
  };

  const openEventDetails = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
    setSelectedTeamId('');
  };

  const isJoined = selectedEvent
    ? joinedEvents.some((joined) => joined.eventId === selectedEvent.id)
    : false;

  const handleApply = async (eventId) => {
    const team = registeredTeams.find((teamEntry) => teamEntry._id === selectedTeamId);
    if (!team) {
      showToast('Select a squad with the matching sport first.', 'error');
      return;
    }

    try {
      await joinEvent(eventId, team);
      showToast(`Applied with ${team.name}!`);
      closeEventDetails();
    } catch {
      showToast('Failed to apply. Try again.', 'error');
    }
  };

  const locations = ['All', ...Array.from(new Set(events.map((event) => event.location || event.venue).filter(Boolean)))];

  const filteredEvents = events
    .filter((event) => sportFilter === 'All' || event.sport === sportFilter)
    .filter((event) => locationFilter === 'All' || (event.location || event.venue) === locationFilter)
    .filter((event) => !dateFilter || event.start === dateFilter)
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.start || a.createdAt || 0);
      const dateB = new Date(b.start || b.createdAt || 0);
      return dateB - dateA;
    });

  return (
    <div className="space-y-8">
      <PageHeader
        label="Step 2"
        title="Browse & join events"
        description="Find tournaments, pick your squad, and apply. Everything is free."
        action={
          registeredTeams.length === 0 ? (
            <Button href="/dashboard/teams" variant="primary">
              Create a squad first
            </Button>
          ) : (
            <Badge variant="green">{registeredTeams.length} squad(s) ready</Badge>
          )
        }
      />

      <Card>
        <div className="grid gap-4 sm:grid-cols-3">
          <Select label="Sport" value={sportFilter} onChange={(e) => setSportFilter(e.target.value)}>
            <option>All</option>
            <option>Basketball</option>
            <option>Football</option>
            <option>Badminton</option>
          </Select>
          <Input label="Date" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          <Select label="Location" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
            {locations.map((location) => (
              <option key={location}>{location}</option>
            ))}
          </Select>
        </div>

        <div className="mt-8">
          {filteredEvents.length === 0 ? (
            <EmptyState
              title="No events found"
              description="Try adjusting filters or check back later."
              action={
                <Button href="/dashboard/organize" variant="secondary">
                  Create an event
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredEvents.map((event) => {
                const joined = joinedEvents.some((j) => j.eventId === event.id);
                return (
                  <article
                    key={event.id}
                    className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 transition hover:border-red-200 hover:bg-white"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 to-red-700 opacity-0 transition group-hover:opacity-100" />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <Badge variant="red">{event.sport}</Badge>
                        <div className="flex gap-2">
                          {joined && <Badge variant="green">Joined</Badge>}
                          <Badge>{event.fee > 0 ? `₹${event.fee}` : 'Free'}</Badge>
                        </div>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-black group-hover:text-red-600 transition">
                        {event.name}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm text-zinc-500">
                        <p>{event.location || event.venue || 'Location TBD'}</p>
                        <p>{event.start || 'Date TBD'} · {event.teams} teams · {event.fixtureType || 'TBD'}</p>
                      </div>
                      <Button
                        variant="primary"
                        className="mt-4 w-full"
                        onClick={() => openEventDetails(event)}
                      >
                        View & apply
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-zinc-200 p-5">
              <div>
                <Badge variant="red">{selectedEvent.sport}</Badge>
                <h2 className="mt-2 text-2xl font-bold text-black">{selectedEvent.name}</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  by {selectedEvent.createdBy || 'Organizer'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEventDetails}
                className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-5 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">Details</p>
                  <div className="mt-2 space-y-1 text-sm text-zinc-700">
                    <p>Location: {selectedEvent.location || 'TBD'}</p>
                    <p>Date: {selectedEvent.start || 'TBD'}</p>
                    <p>Format: {selectedEvent.fixtureType || 'TBD'}</p>
                    <p>Teams: {selectedEvent.teams || 'TBD'}</p>
                    <p>Fee: {selectedEvent.fee > 0 ? `₹${selectedEvent.fee}` : 'Free'}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">Description</p>
                  <p className="mt-2 text-sm text-zinc-700">
                    {selectedEvent.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {selectedEvent.fixtures?.length > 0 && (
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">Fixtures</p>
                  <ol className="mt-2 space-y-1 list-decimal list-inside text-sm text-zinc-600">
                    {selectedEvent.fixtures.map((fixture, index) => (
                      <li key={index}>{fixture}</li>
                    ))}
                  </ol>
                </div>
              )}

              {!isJoined && (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <Select
                    label="Select your squad"
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                  >
                    <option value="">Choose a squad</option>
                    {registeredTeams
                      .filter((team) => team.sport === selectedEvent.sport)
                      .map((team) => (
                        <option key={team._id} value={team._id}>
                          {team.name} ({team.players.length} players)
                        </option>
                      ))}
                  </Select>
                  {registeredTeams.filter((team) => team.sport === selectedEvent.sport).length === 0 && (
                    <p className="mt-2 text-sm text-red-600">
                      No {selectedEvent.sport} squad found.{' '}
                      <a href="/dashboard/teams" className="underline">Create one</a>
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {isJoined ? (
                  <Button
                    variant="danger"
                    onClick={async () => {
                      await discardJoin(selectedEvent.id);
                      showToast('Application withdrawn.');
                      closeEventDetails();
                    }}
                  >
                    Withdraw application
                  </Button>
                ) : (
                  <Button variant="primary" onClick={() => handleApply(selectedEvent.id)}>
                    Apply to event
                  </Button>
                )}

                {selectedEvent.createdBy === currentUser?.name && (
                  <Button
                    variant="danger"
                    onClick={async () => {
                      await deleteEvent(selectedEvent.id);
                      showToast('Event deleted.');
                      closeEventDetails();
                    }}
                  >
                    Delete event
                  </Button>
                )}
              </div>
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
