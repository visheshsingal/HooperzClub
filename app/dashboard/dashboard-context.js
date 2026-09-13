'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const DashboardContext = createContext(null);
const apiBase = '/api/dashboard';

export function DashboardProvider({ children, user }) {
  const [events, setEvents] = useState([]);
  const [registeredTeams, setRegisteredTeams] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(user || null);

  useEffect(() => {
    setCurrentUser(user || null);
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsRes, teamsRes, joinedRes] = await Promise.all([
          fetch(`${apiBase}/events`),
          fetch(`${apiBase}/teams`),
          fetch(`${apiBase}/joined`),
        ]);

        if (!eventsRes.ok || !teamsRes.ok || !joinedRes.ok) {
          throw new Error('Failed to load dashboard data');
        }

        const [loadedEvents, loadedTeams, loadedJoined] = await Promise.all([
          eventsRes.json(),
          teamsRes.json(),
          joinedRes.json(),
        ]);

        setEvents(loadedEvents);
        setRegisteredTeams(loadedTeams);
        setJoinedEvents(loadedJoined);
      } catch (error) {
        console.error('Unable to load dashboard data:', error);
      }
    };

    loadData();
  }, []);

  const updateCurrentUser = (updates) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const addEvent = async (event) => {
    const enrichedEvent = {
      ...event,
      fixtures: event.fixtures ?? [],
      createdBy: currentUser?.name || 'Organizer',
      createdAt: new Date().toISOString(),
    };

    const response = await fetch(`${apiBase}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enrichedEvent),
    });

    if (!response.ok) {
      throw new Error('Unable to save event.');
    }

    const savedEvent = await response.json();
    setEvents((prev) => [savedEvent, ...prev]);
  };

  const registerTeam = async (team) => {
    const response = await fetch(`${apiBase}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(team),
    });

    if (!response.ok) {
      throw new Error('Unable to save team.');
    }

    const savedTeam = await response.json();
    setRegisteredTeams((prev) => [savedTeam, ...prev]);
  };

  const updateTeam = async (team) => {
    const response = await fetch(`${apiBase}/teams`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(team),
    });

    if (!response.ok) {
      throw new Error('Unable to update team.');
    }

    const updatedTeam = await response.json();
    setRegisteredTeams((prev) => prev.map((existing) => (existing._id === updatedTeam._id ? updatedTeam : existing)));
  };

  const deleteTeam = async (teamId) => {
    const response = await fetch(`${apiBase}/teams?teamId=${encodeURIComponent(teamId)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Unable to delete team.');
    }

    setRegisteredTeams((prev) => prev.filter((team) => team._id !== teamId));
  };

  const deleteEvent = async (eventId) => {
    const response = await fetch(`${apiBase}/events?eventId=${encodeURIComponent(eventId)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Unable to delete event.');
    }

    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    setJoinedEvents((prev) => prev.filter((joined) => joined.eventId !== eventId));
  };

  const joinEvent = async (eventId, position = 'Point Guard (PG)', participantName = '', friends = []) => {
    const payload = {
      eventId,
      position,
      participantName: participantName || currentUser?.name || 'Player',
      friends,
    };

    const response = await fetch(`${apiBase}/joined`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || 'Unable to join event.');
    }

    const resData = await response.json();
    // Refresh joined events list to include main user + friends
    const joinedRes = await fetch(`${apiBase}/joined`);
    if (joinedRes.ok) {
      setJoinedEvents(await joinedRes.json());
    }
    return resData;
  };

  const discardJoin = async (eventId) => {
    const response = await fetch(`${apiBase}/joined?eventId=${encodeURIComponent(eventId)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Unable to discard join.');
    }

    setJoinedEvents((prev) => {
      const index = prev.map((joined) => joined.eventId).lastIndexOf(eventId);
      if (index === -1) return prev;
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  };

  const addJoinedEvent = (joined) => {
    setJoinedEvents((prev) => [joined, ...prev]);
  };

  const generateFixtures = (eventId, format, count, teamNames) => {
    const activeTeams = teamNames.length > 0 ? teamNames.slice(0, count) : Array.from({ length: count }, (_, idx) => `Team ${idx + 1}`);
    const generated = [];

    if (format === 'Knockout') {
      for (let i = 0; i < Math.floor(activeTeams.length / 2); i += 1) {
        generated.push(`Match ${i + 1}: ${activeTeams[i]} vs ${activeTeams[activeTeams.length - 1 - i]}`);
      }
    } else if (format === 'League') {
      let index = 1;
      for (let i = 0; i < activeTeams.length; i += 1) {
        for (let j = i + 1; j < activeTeams.length; j += 1) {
          generated.push(`Match ${index}: ${activeTeams[i]} vs ${activeTeams[j]}`);
          index += 1;
        }
      }
    } else if (format === 'Round Robin') {
      let round = 1;
      for (let i = 0; i < activeTeams.length; i += 1) {
        for (let j = i + 1; j < activeTeams.length; j += 1) {
          generated.push(`Round ${round}: ${activeTeams[i]} vs ${activeTeams[j]}`);
          round += 1;
        }
      }
    } else {
      generated.push('Group + Knockout will create brackets once teams are confirmed.');
    }

    if (eventId) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, fixtures: generated } : event
        )
      );
    }

    return generated;
  };

  return (
    <DashboardContext.Provider
      value={{
        events,
        registeredTeams,
        joinedEvents,
        addEvent,
        registerTeam,
        updateTeam,
        deleteTeam,
        joinEvent,
        addJoinedEvent,
        deleteEvent,
        discardJoin,
        generateFixtures,
        currentUser,
        updateCurrentUser,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
