'use client';

import { useEffect, useState } from 'react';
import { useDashboard } from '../dashboard-context';
import EventPayment from './event-payment';

export default function EventsPage() {
  const { events, registeredTeams, joinedEvents, joinEvent, addJoinedEvent, deleteEvent, discardJoin, currentUser } = useDashboard();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [isPaymentRequested, setIsPaymentRequested] = useState(false);
  const [sportFilter, setSportFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');

  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setIsPaymentRequested(false);
  };
  const closeEventDetails = () => {
    setSelectedEvent(null);
    setSelectedTeamId('');
    setIsPaymentRequested(false);
  };

  const handleTeamSelect = (event) => setSelectedTeamId(event.target.value);
  const selectedTeam = registeredTeams.find((teamEntry) => teamEntry._id === selectedTeamId);

  const handleApply = (eventId) => {
    const team = registeredTeams.find((teamEntry) => teamEntry._id === selectedTeamId);
    if (!team) {
      alert('Choose a squad with the same sport before applying.');
      return;
    }

    const event = events.find((item) => item.id === eventId);
    if (event?.fee > 0) {
      setIsPaymentRequested(true);
      return;
    }

    joinEvent(eventId, team);
    alert(`Squad ${team.name} applied successfully.`);
  };

  const handlePaymentSuccess = (joined) => {
    addJoinedEvent(joined);
    closeEventDetails();
    alert('Payment successful and application complete.');
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
      <section className="rounded-xl border border-white/10 bg-[#181818] p-8 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Browse events</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Find your next tournament</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">Review active tournaments, apply with your squad, and build your competition pipeline in one place.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-slate-200">
            {registeredTeams.length === 0 ? 'No squads registered yet' : `${registeredTeams.length} squad(s) ready`}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="text-sm text-slate-400">Showing latest events first</div>
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <span>Sport</span>
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-2 text-sm text-white outline-none focus:border-[#8e2a2a]"
            >
              <option>All</option>
              <option>Basketball</option>
              <option>Football</option>
              <option>Tennis</option>
            </select>
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <span>Date</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-2 text-sm text-white outline-none focus:border-[#8e2a2a]"
            />
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <span>Location</span>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-2 text-sm text-white outline-none focus:border-[#8e2a2a]"
            >
              {locations.map((location) => (
                <option key={location}>{location}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {filteredEvents.map((event) => {
            const joinedCount = joinedEvents.filter((joined) => joined.eventId === event.id).length;
            return (
              <article key={event.id} className="group rounded-2xl border border-white/10 bg-[#141414] p-5 transition hover:border-[#8e2a2a] hover:bg-white/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{event.name}</h3>
                    <p className="mt-3 text-sm text-slate-300">{event.location || event.venue || 'Location TBD'}</p>
                    <p className="mt-1 text-sm text-slate-400">{event.start || 'Date TBD'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                      <button
                      type="button"
                      onClick={() => openEventDetails(event)}
                      className="rounded-full border border-white/10 bg-[#7f2b2b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#8e2a2a]"
                    >
                      View details
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-xl max-h-[calc(100vh-140px)] overflow-hidden rounded-3xl border border-white/10 bg-[#141414] text-slate-200 shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-[#161616] p-5">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Event details</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{selectedEvent.name}</h2>
              </div>
              <button
                type="button"
                onClick={closeEventDetails}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="max-h-[calc(100vh-190px)] overflow-y-auto p-5">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4 rounded-3xl border border-white/10 bg-[#181818] p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Basic info</p>
                    <p className="mt-2 text-sm text-slate-300">Sport: {selectedEvent.sport}</p>
                    <p className="mt-1 text-sm text-slate-300">Type: {selectedEvent.type}</p>
                    <p className="mt-1 text-sm text-slate-300">Location: {selectedEvent.location || selectedEvent.venue || 'TBD'}</p>
                    <p className="mt-1 text-sm text-slate-300">Date: {selectedEvent.start || 'TBD'}</p>
                    <p className="mt-1 text-sm text-slate-300">Creator: {selectedEvent.createdBy || 'Organizer'}</p>
                    <p className="mt-1 text-sm text-slate-300">Registration fee: {selectedEvent.fee > 0 ? `₹${selectedEvent.fee}` : 'Free'}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Fixture details</p>
                    <p className="mt-2 text-sm text-slate-300">Fixture: {selectedEvent.fixtureTitle || 'No title'}</p>
                    <p className="mt-1 text-sm text-slate-300">Format: {selectedEvent.fixtureType || 'None'}</p>
                    <p className="mt-1 text-sm text-slate-300">Teams: {selectedEvent.teams || 'TBD'}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Joined squads</p>
                    <p className="mt-2 text-sm text-slate-300">{joinedEvents.filter((joined) => joined.eventId === selectedEvent.id).length} squad(s)</p>
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-white/10 bg-[#181818] p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Description</p>
                    <p className="mt-2 text-sm text-slate-300">{selectedEvent.description || 'No description available.'}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Fixtures</p>
                    {selectedEvent.fixtures?.length > 0 ? (
                      <ol className="mt-3 space-y-2 list-decimal list-inside text-sm text-slate-300">
                        {selectedEvent.fixtures.map((fixture, index) => (
                          <li key={index}>{fixture}</li>
                        ))}
                      </ol>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">No fixtures generated yet.</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 text-sm text-slate-300">
                    <div className="rounded-2xl border border-white/10 bg-[#141414] p-4">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Select squad to apply</p>
                      <select
                        value={selectedTeamId}
                        onChange={handleTeamSelect}
                        className="mt-3 w-full rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
                      >
                        <option value="">Choose a squad</option>
                        {registeredTeams
                          .filter((team) => team.sport === selectedEvent.sport)
                          .map((team) => (
                            <option key={team._id} value={team._id}>
                              {team.name} ({team.sport})
                            </option>
                          ))}
                      </select>
                      {registeredTeams.filter((team) => team.sport === selectedEvent.sport).length === 0 && (
                        <p className="mt-2 text-sm text-slate-500">No registered squads for {selectedEvent.sport}. Create a matching squad in Teams.</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {joinedEvents.some((joined) => joined.eventId === selectedEvent.id) ? (
                        <button
                          type="button"
                          onClick={() => discardJoin(selectedEvent.id)}
                          className="mt-4 inline-flex rounded-full bg-[#8e2a2a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#a05b5b]"
                        >
                          Discard application
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApply(selectedEvent.id)}
                          className="mt-4 inline-flex rounded-full bg-[#2a6f8e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4b95b3]"
                        >
                          Apply to event
                        </button>
                      )}

                      {selectedEvent.createdBy === currentUser?.name && (
                        <button
                          type="button"
                          onClick={() => {
                            deleteEvent(selectedEvent.id);
                            closeEventDetails();
                          }}
                          className="mt-4 inline-flex rounded-full bg-[#8e2a2a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#a05b5b]"
                        >
                          Delete event
                        </button>
                      )}
                    </div>

                    {isPaymentRequested && selectedEvent?.fee > 0 && selectedTeam ? (
                      <EventPayment
                        event={selectedEvent}
                        team={selectedTeam}
                        onSuccess={(joined) => {
                          handlePaymentSuccess(joined);
                          setIsPaymentRequested(false);
                        }}
                        onError={(err) => {
                          console.error(err);
                          alert(err.message || 'Payment failed.');
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
