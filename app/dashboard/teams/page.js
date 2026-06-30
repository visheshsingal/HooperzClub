'use client';

import { useState } from 'react';
import { useDashboard } from '../dashboard-context';

export default function TeamsPage() {
  const { registeredTeams, registerTeam, updateTeam, deleteTeam } = useDashboard();
  const [editingTeam, setEditingTeam] = useState(null);
  const [formState, setFormState] = useState({ name: '', sport: 'Football', players: '' });
  const [newTeam, setNewTeam] = useState({ name: '', sport: 'Football', players: '' });

  const handleEditClick = (team) => {
    setEditingTeam(team);
    setFormState({ name: team.name, sport: team.sport, players: team.players.join(', ') });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editingTeam) return;

    await updateTeam({
      teamId: editingTeam._id,
      name: formState.name,
      sport: formState.sport,
      players: formState.players.split(',').map((player) => player.trim()).filter(Boolean),
    });
    setEditingTeam(null);
    setFormState({ name: '', sport: 'Football', players: '' });
  };

  const handleCreateTeam = async (event) => {
    event.preventDefault();
    await registerTeam({
      name: newTeam.name,
      sport: newTeam.sport,
      players: newTeam.players.split(',').map((player) => player.trim()).filter(Boolean),
    });
    setNewTeam({ name: '', sport: 'Football', players: '' });
  };

  const teamCount = registeredTeams.length;

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-white/10 bg-[#181818] p-8 shadow-2xl shadow-black/20">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Squad manager</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Manage your registered squads</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">Create squads, update details, and delete teams before applying to tournaments.</p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-[#141414] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Total squads</p>
            <p className="mt-3 text-4xl font-semibold text-white">{teamCount}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#141414] p-6 lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Create new squad</p>
            <form className="mt-4 space-y-4" onSubmit={handleCreateTeam}>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  Squad name
                  <input
                    name="name"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  Sport
                  <select
                    name="sport"
                    value={newTeam.sport}
                    onChange={(e) => setNewTeam((prev) => ({ ...prev, sport: e.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
                  >
                    <option>Football</option>
                    <option>Basketball</option>
                    <option>Tennis</option>
                  </select>
                </label>
              </div>

              <label className="space-y-2 text-sm text-slate-300">
                Player list
                <textarea
                  name="players"
                  rows="4"
                  value={newTeam.players}
                  onChange={(e) => setNewTeam((prev) => ({ ...prev, players: e.target.value }))}
                  placeholder="Add player names separated by commas"
                  className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
                />
              </label>

              <button className="inline-flex items-center justify-center rounded-xl bg-[#7f2b2b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8e2a2a]">
                Save squad
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-[#141414] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Your squads</p>
          <div className="mt-4 space-y-3">
            {registeredTeams.length === 0 ? (
              <p className="text-sm text-slate-400">No squads registered yet.</p>
            ) : (
              registeredTeams.map((team) => (
                <div key={team._id} className="rounded-3xl border border-white/10 bg-[#181818] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{team.sport}</p>
                      <h2 className="mt-2 text-xl font-semibold text-white">{team.name}</h2>
                      <p className="mt-1 text-sm text-slate-300">Players: {team.players.length}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditClick(team)}
                        className="rounded-full border border-white/10 bg-[#7f2b2b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#8e2a2a]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTeam(team._id)}
                        className="rounded-full border border-white/10 bg-[#8e2a2a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#a05b5b]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {editingTeam && (
        <section className="rounded-xl border border-white/10 bg-[#181818] p-8 shadow-2xl shadow-black/20">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Edit squad</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Update your team details</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">Change the squad name, sport, or player list before applying to an event.</p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                Squad name
                <input
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Sport
                <select
                  name="sport"
                  value={formState.sport}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
                >
                  <option>Football</option>
                  <option>Basketball</option>
                  <option>Tennis</option>
                </select>
              </label>
            </div>

            <label className="space-y-2 text-sm text-slate-300">
              Player list
              <textarea
                name="players"
                rows="4"
                value={formState.players}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-[#141414] px-4 py-3 text-sm text-white outline-none focus:border-[#8e2a2a]"
              />
            </label>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-[#7f2b2b] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#8e2a2a]"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={() => setEditingTeam(null)}
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-[#141414] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
