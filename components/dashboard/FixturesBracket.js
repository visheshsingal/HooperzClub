'use client';

import { useState } from 'react';

export default function FixturesBracket({ fixtures = [], isAdmin = false, onUpdateMatch = null }) {
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [scoreA, setScoreA] = useState('');
  const [scoreB, setScoreB] = useState('');
  const [selectedWinner, setSelectedWinner] = useState('');
  const [saving, setSaving] = useState(false);

  if (!fixtures || fixtures.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
        No match fixtures generated yet for this event.
      </div>
    );
  }

  // Group matches by round name
  const roundMap = {};
  fixtures.forEach((match) => {
    const roundName = match.round || `Round ${match.roundIndex || 1}`;
    if (!roundMap[roundName]) {
      roundMap[roundName] = [];
    }
    roundMap[roundName].push(match);
  });

  const rounds = Object.keys(roundMap);

  const handleEditClick = (match) => {
    setEditingMatchId(match.id);
    setScoreA(match.scoreA ?? 0);
    setScoreB(match.scoreB ?? 0);
    setSelectedWinner(match.winner || match.teamA || '');
  };

  const handleSaveMatch = async (match) => {
    if (!onUpdateMatch) return;
    setSaving(true);
    try {
      const numA = Number(scoreA) || 0;
      const numB = Number(scoreB) || 0;
      let winner = selectedWinner;

      if (!winner || winner === 'AUTO') {
        if (numA > numB) winner = match.teamA;
        else if (numB > numA) winner = match.teamB;
        else winner = match.teamA;
      }

      await onUpdateMatch(match.id, numA, numB, winner);
      setEditingMatchId(null);
    } catch (err) {
      console.error('Failed to save score', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3">
        <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900">
          Tournament Fixtures & Match Schedule
        </h4>
        <span className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-bold text-red-700 uppercase tracking-widest">
          {fixtures.length} Total Matches
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rounds.map((roundName) => (
          <div key={roundName} className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                {roundName}
              </span>
              <span className="text-[10px] font-semibold text-zinc-400">
                {roundMap[roundName].length} {roundMap[roundName].length === 1 ? 'Match' : 'Matches'}
              </span>
            </div>

            <div className="space-y-3">
              {roundMap[roundName].map((match) => {
                const isEditing = editingMatchId === match.id;
                const isCompleted = match.status === 'Completed';

                return (
                  <div
                    key={match.id}
                    className={`rounded-xl border p-3.5 transition ${
                      isCompleted
                        ? 'border-emerald-200 bg-emerald-50/70 shadow-sm'
                        : 'border-zinc-200 bg-white shadow-sm'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between text-[10px] font-semibold text-zinc-400">
                      <span>Match #{match.matchNumber || match.id}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                          isCompleted
                            ? 'bg-emerald-200 text-emerald-800'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {isCompleted ? '✓ Completed' : 'Scheduled'}
                      </span>
                    </div>

                    {/* Team A */}
                    <div className="flex items-center justify-between text-sm py-1.5 border-b border-zinc-100">
                      <span
                        className={`font-semibold ${
                          match.winner === match.teamA ? 'text-red-600 font-bold' : 'text-zinc-800'
                        }`}
                      >
                        {match.teamA || 'TBD'}
                        {match.winner === match.teamA && ' 🏆'}
                      </span>
                      <span className="font-mono font-bold text-zinc-900">
                        {isEditing ? (
                          <input
                            type="number"
                            value={scoreA}
                            onChange={(e) => setScoreA(e.target.value)}
                            className="w-12 rounded border border-zinc-300 px-1 py-0.5 text-center text-xs"
                          />
                        ) : (
                          match.scoreA ?? 0
                        )}
                      </span>
                    </div>

                    {/* Team B */}
                    <div className="flex items-center justify-between text-sm py-1.5">
                      <span
                        className={`font-semibold ${
                          match.winner === match.teamB ? 'text-red-600 font-bold' : 'text-zinc-800'
                        }`}
                      >
                        {match.teamB || 'TBD'}
                        {match.winner === match.teamB && ' 🏆'}
                      </span>
                      <span className="font-mono font-bold text-zinc-900">
                        {isEditing ? (
                          <input
                            type="number"
                            value={scoreB}
                            onChange={(e) => setScoreB(e.target.value)}
                            className="w-12 rounded border border-zinc-300 px-1 py-0.5 text-center text-xs"
                          />
                        ) : (
                          match.scoreB ?? 0
                        )}
                      </span>
                    </div>

                    {/* Admin Winner Selector & Edit Controls */}
                    {isAdmin && (
                      <div className="mt-3 border-t border-zinc-200 pt-2 space-y-2">
                        {isEditing ? (
                          <div className="space-y-2">
                            <div>
                              <label className="block text-[9px] font-bold uppercase text-zinc-500">
                                Select Match Winner:
                              </label>
                              <select
                                value={selectedWinner}
                                onChange={(e) => setSelectedWinner(e.target.value)}
                                className="mt-0.5 w-full rounded-lg border border-zinc-300 px-2 py-1 text-xs text-black"
                              >
                                <option value={match.teamA}>{match.teamA || 'Team A'}</option>
                                <option value={match.teamB}>{match.teamB || 'Team B'}</option>
                              </select>
                            </div>

                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingMatchId(null)}
                                className="rounded-lg px-2 py-1 text-[10px] font-semibold text-zinc-500 hover:bg-zinc-100"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                disabled={saving}
                                onClick={() => handleSaveMatch(match)}
                                className="rounded-lg bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-red-500 disabled:opacity-50"
                              >
                                {saving ? 'Saving...' : 'Declare Winner & Advance →'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleEditClick(match)}
                              className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-semibold text-zinc-700 hover:bg-zinc-100"
                            >
                              Update Score & Winner
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
