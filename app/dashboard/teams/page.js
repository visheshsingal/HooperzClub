'use client';

import { useState } from 'react';
import { useDashboard } from '../dashboard-context';
import {
  PageHeader,
  Card,
  Button,
  Input,
  Select,
  Textarea,
  EmptyState,
  Badge,
  Toast,
} from '../../../components/dashboard/ui';

export default function TeamsPage() {
  const { registeredTeams, registerTeam, updateTeam, deleteTeam } = useDashboard();
  const [editingTeam, setEditingTeam] = useState(null);
  const [formState, setFormState] = useState({ name: '', sport: 'Football', players: '' });
  const [newTeam, setNewTeam] = useState({ name: '', sport: 'Football', players: '' });
  const [toast, setToast] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(''), 3500);
  };

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

    try {
      await updateTeam({
        teamId: editingTeam._id,
        name: formState.name,
        sport: formState.sport,
        players: formState.players.split(',').map((player) => player.trim()).filter(Boolean),
      });
      setEditingTeam(null);
      setFormState({ name: '', sport: 'Football', players: '' });
      showToast('Squad updated successfully!');
    } catch {
      showToast('Failed to update squad.', 'error');
    }
  };

  const handleCreateTeam = async (event) => {
    event.preventDefault();
    try {
      await registerTeam({
        name: newTeam.name,
        sport: newTeam.sport,
        players: newTeam.players.split(',').map((player) => player.trim()).filter(Boolean),
      });
      setNewTeam({ name: '', sport: 'Football', players: '' });
      showToast('Squad created! Head to Events to join a tournament.');
    } catch {
      showToast('Failed to create squad.', 'error');
    }
  };

  const handleDelete = async (teamId) => {
    if (!window.confirm('Delete this squad?')) return;
    try {
      await deleteTeam(teamId);
      showToast('Squad deleted.');
    } catch {
      showToast('Failed to delete squad.', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        label="Step 1"
        title="Build your squad"
        description="Create squads with player names. You'll need a squad to join tournaments."
      />

      <Card glow={registeredTeams.length === 0}>
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
            1
          </div>
          <div>
            <h2 className="text-lg font-semibold text-black">Create a new squad</h2>
            <p className="text-sm text-zinc-600">Add player names separated by commas</p>
          </div>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleCreateTeam}>
          <div className="grid gap-5 lg:grid-cols-2">
            <Input
              label="Squad name"
              name="name"
              value={newTeam.name}
              onChange={(e) => setNewTeam((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Mumbai Strikers"
              required
            />
            <Select
              label="Sport"
              name="sport"
              value={newTeam.sport}
              onChange={(e) => setNewTeam((prev) => ({ ...prev, sport: e.target.value }))}
            >
              <option>Football</option>
              <option>Basketball</option>
              <option>Badminton</option>
            </Select>
          </div>

          <Textarea
            label="Players"
            name="players"
            rows={3}
            value={newTeam.players}
            onChange={(e) => setNewTeam((prev) => ({ ...prev, players: e.target.value }))}
            placeholder="Rahul, Amit, Vikram, Suresh..."
          />

          <Button type="submit" variant="primary">
            Save squad
          </Button>
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black">
            Your squads
            <span className="ml-2 text-sm font-normal text-zinc-500">({registeredTeams.length})</span>
          </h2>
        </div>

        <div className="mt-6 space-y-3">
          {registeredTeams.length === 0 ? (
            <EmptyState
              title="No squads yet"
              description="Create your first squad above to start joining tournaments."
            />
          ) : (
            registeredTeams.map((team) => (
              <div
                key={team._id}
                className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="red">{team.sport}</Badge>
                    <span className="text-xs text-zinc-500">{team.players.length} players</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-black">{team.name}</h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    {team.players.slice(0, 4).join(', ')}
                    {team.players.length > 4 ? ` +${team.players.length - 4} more` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleEditClick(team)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(team._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {editingTeam && (
        <Card className="border-red-200 bg-red-50/40">
          <h2 className="text-lg font-semibold text-black">Edit squad</h2>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 lg:grid-cols-2">
              <Input label="Squad name" name="name" value={formState.name} onChange={handleChange} required />
              <Select label="Sport" name="sport" value={formState.sport} onChange={handleChange}>
                <option>Football</option>
                <option>Basketball</option>
                <option>Badminton</option>
              </Select>
            </div>
            <Textarea label="Players" name="players" rows={3} value={formState.players} onChange={handleChange} />
            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                Save changes
              </Button>
              <Button variant="ghost" onClick={() => setEditingTeam(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {registeredTeams.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="text-sm text-zinc-700">
            Squad ready! Next step:{' '}
            <a href="/dashboard/events" className="font-semibold text-red-600 hover:text-red-500">
              Browse events →
            </a>
          </p>
        </div>
      )}

      <Toast
        message={toast ? (typeof toast === 'string' ? toast : toast.msg) : ''}
        type={toast && typeof toast !== 'string' ? toast.type : 'success'}
        onClose={() => setToast('')}
      />
    </div>
  );
}
