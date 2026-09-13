'use client';

import { useState } from 'react';
import { useDashboard } from '../dashboard-context';
import FixturesBracket from '../../../components/dashboard/FixturesBracket';
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
    joinedEvents,
    joinEvent,
    discardJoin,
  } = useDashboard();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formatFilter, setFormatFilter] = useState('All');
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
  };

  const isJoined = selectedEvent
    ? joinedEvents.some((joined) => joined.eventId === selectedEvent.id)
    : false;

  const handleApply = async (eventId) => {
    try {
      await joinEvent(eventId, null);
      showToast('You are registered for this Basketball event!');
    } catch {
      showToast('Failed to register. Please try again.', 'error');
    }
  };

  const locations = [
    'All',
    ...Array.from(new Set(events.map((event) => event.location || event.venue).filter(Boolean))),
  ];

  const filteredEvents = events
    .filter((event) => formatFilter === 'All' || (event.format || '3v3') === formatFilter)
    .filter(
      (event) =>
        locationFilter === 'All' || (event.location || event.venue) === locationFilter
    )
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.start || a.createdAt || 0);
      const dateB = new Date(b.start || b.createdAt || 0);
      return dateB - dateA;
    });

  return (
    <div className="space-y-8">
      <PageHeader
        label="Basketball Tournaments"
        title="Official Basketball Events & Fixtures"
        description="Browse official Basketball tournaments, register your squad, and view live match brackets & fixtures."
        action={<Badge variant="red">Basketball Only</Badge>}
      />

      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Basketball Format"
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
          >
            <option value="All">All Formats (1v1, 2v2, 3v3, 5v5)</option>
            <option value="1v1">1v1 Isolation</option>
            <option value="2v2">2v2 Half-Court</option>
            <option value="3v3">3v3 Streetball</option>
            <option value="5v5">5v5 Full Court</option>
          </Select>

          <Select
            label="Venue Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-8">
          {filteredEvents.length === 0 ? (
            <EmptyState
              title="No Basketball Events Found"
              description="There are currently no active Basketball tournaments matching your filters. Check back soon for upcoming Admin published events!"
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {filteredEvents.map((event) => {
                const joined = joinedEvents.some((j) => j.eventId === event.id);

                return (
                  <article
                    key={event.id}
                    className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-red-300 hover:shadow-md"
                  >
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-500 to-red-700" />
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white">
                          Basketball {event.format ? `(${event.format})` : '(3v3)'}
                        </span>
                        <div className="flex gap-2">
                          {joined && (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                              ✓ Registered
                            </span>
                          )}
                          <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-bold text-zinc-700">
                            {event.fee > 0 ? `$${event.fee}` : 'Free Entry'}
                          </span>
                        </div>
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-black transition group-hover:text-red-600">
                        {event.name}
                      </h3>

                      <div className="mt-3 space-y-1 text-sm text-zinc-600">
                        <p className="flex items-center gap-1.5">
                          <span>📍</span> {event.location || event.venue || 'Venue TBD'}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <span>📅</span>{' '}
                          {event.start ? new Date(event.start).toLocaleString() : 'Date TBD'}{' '}
                          • {event.teams || event.teamCount || 8} Teams Max
                        </p>
                      </div>

                      <div className="mt-6 flex items-center gap-3">
                        {joined ? (
                          <Button
                            variant="secondary"
                            className="w-full justify-center"
                            onClick={() => openEventDetails(event)}
                          >
                            View Fixtures & Bracket →
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            className="w-full justify-center"
                            onClick={() => handleApply(event.id)}
                          >
                            Register for Event
                          </Button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Event Details & Match Fixtures Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-zinc-200 p-6 bg-zinc-50">
              <div>
                <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white">
                  Basketball ({selectedEvent.format || '3v3'})
                </span>
                <h2 className="mt-2 text-2xl font-bold text-black">{selectedEvent.name}</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Published by Admin • 📍 {selectedEvent.location || 'TBD'} • 📅{' '}
                  {selectedEvent.start ? new Date(selectedEvent.start).toLocaleString() : 'TBD'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeEventDetails}
                className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-200 hover:text-black"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6 space-y-6">
              {/* Event Info Header */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Match Format</p>
                  <p className="mt-1 text-base font-bold text-zinc-900">{selectedEvent.format || '3v3'} Basketball</p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tournament Type</p>
                  <p className="mt-1 text-base font-bold text-zinc-900">{selectedEvent.tournamentType || 'Knockout'}</p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Registration</p>
                  <p className="mt-1 text-base font-bold text-emerald-600">
                    {isJoined ? '✓ You are Registered' : 'Open'}
                  </p>
                </div>
              </div>

              {/* Tournament Fixtures Component */}
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <FixturesBracket fixtures={selectedEvent.fixtures || []} isAdmin={false} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-4">
                {isJoined ? (
                  <Button
                    variant="danger"
                    onClick={async () => {
                      await discardJoin(selectedEvent.id);
                      showToast('Registration withdrawn.');
                      closeEventDetails();
                    }}
                  >
                    Withdraw Registration
                  </Button>
                ) : (
                  <Button variant="primary" onClick={() => handleApply(selectedEvent.id)}>
                    Register Now
                  </Button>
                )}

                <Button variant="secondary" onClick={closeEventDetails}>
                  Close Window
                </Button>
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
