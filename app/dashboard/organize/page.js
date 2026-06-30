'use client';

import { useMemo, useState } from 'react';
import { useDashboard } from '../dashboard-context';

const formats = ['Knockout', 'League', 'Round Robin', 'Group + Knockout'];

export default function OrganizePage() {
  const { registeredTeams, addEvent, generateFixtures } = useDashboard();
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

  const upcomingTeams = useMemo(() => registeredTeams.map((team) => team.name), [registeredTeams]);

  const handleCreateChange = (event) => {
    const { name, value } = event.target;
    setCreateData((prev) => ({
      ...prev,
      [name]: name === 'teamCount' || name === 'fee' ? Number(value) : value,
    }));
  };

  const handleGenerateFixtures = (event) => {
    event.preventDefault();
    const generated = generateFixtures(null, createData.fixtureType, createData.teamCount, upcomingTeams);
    setFixtures(generated);
  };

  const handleCreateTournament = (event) => {
    event.preventDefault();
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

    addEvent(newEvent);
    console.log('That event has been published:', newEvent.name);
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
  };

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-white/10 bg-[#181818] p-8 shadow-2xl shadow-black/20">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Organize</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Create events & manage fixtures</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">Build your next tournament, then generate matchups automatically with the same organizer workflow.</p>
          <div className="mt-4 rounded-2xl bg-[#0f0f0f] p-4 text-sm text-slate-300">
            <p>Event creation costs 1 credit.</p>
            <p className="mt-2 text-slate-400">If your credits reach 0, buy credits in the new Credits tab before organizing again.</p>
          </div>
        </div>

      </section>

      <section className="rounded-xl border border-white/10 bg-[#181818] p-8 shadow-2xl shadow-black/20">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Create events & manage fixtures</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Launch a new tournament</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">Add a tournament to your events list and generate fixtures from the same form.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleCreateTournament}>
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              Tournament Name
              <input
                name="name"
                value={createData.name}
                onChange={handleCreateChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Sport Type
              <select
                name="sport"
                value={createData.sport}
                onChange={handleCreateChange}
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
              >
                <option>Football</option>
                <option>Basketball</option>
                <option>Tennis</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-300">
              Fixture type
              <select
                name="fixtureType"
                value={createData.fixtureType}
                onChange={handleCreateChange}
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
              >
                {formats.map((format) => (
                  <option key={format}>{format}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Fixture title
              <input
                name="fixtureTitle"
                value={createData.fixtureTitle}
                onChange={handleCreateChange}
                placeholder="E.g. Quarterfinal Draw"
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Team count
              <input
                name="teamCount"
                type="number"
                min="2"
                value={createData.teamCount}
                onChange={handleCreateChange}
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
              />
            </label>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              Location
              <input
                name="location"
                value={createData.location}
                onChange={handleCreateChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Start Date
              <input
                name="start"
                type="date"
                value={createData.start}
                onChange={handleCreateChange}
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-slate-300">
            Registration Fee
            <input
              name="fee"
              type="number"
              min="0"
              value={createData.fee}
              onChange={handleCreateChange}
              className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Description
            <textarea
              name="description"
              rows="4"
              value={createData.description}
              onChange={handleCreateChange}
              className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleGenerateFixtures}
              className="inline-flex items-center justify-center rounded-xl bg-[#7f2b2b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8e2a2a]"
            >
              Generate fixture list
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Publish event
            </button>
          </div>
        </form>

        <div className="mt-8 rounded-xl border border-white/10 bg-[#141414] p-8 shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Fixture preview</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Generated schedule</h2>
            </div>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">Live</span>
          </div>

          <div className="mt-6 space-y-3">
            {fixtures.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-5 text-sm text-slate-400">No fixtures generated yet. Use the button above to preview the schedule.</div>
            ) : (
              fixtures.map((fixture, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-4 text-sm text-slate-200">{fixture}</div>
              ))
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-[#181818] p-5 text-sm text-slate-300">
            <p className="font-semibold text-slate-200">Registered squads</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{upcomingTeams.length} squad(s) available for fixtures.</p>
            {upcomingTeams.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No squads registered yet. Placeholder teams will be used when generating fixtures.</p>
            ) : (
              <div className="mt-4 grid gap-2 text-sm text-slate-300">
                {upcomingTeams.map((team) => (
                  <span key={team} className="rounded-2xl bg-black/20 px-3 py-2">{team}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
