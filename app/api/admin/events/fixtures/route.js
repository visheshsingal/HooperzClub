import clientPromise from '../../../../../lib/mongodb.js';
import { verifyAdminToken } from '../../../../../lib/auth.js';

function parseBearerToken(request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.replace('Bearer ', '').trim();
}

export async function POST(request) {
  const token = parseBearerToken(request);
  const verified = verifyAdminToken(token);
  if (!verified) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body = await request.json();
    const { eventId, matchId, scoreA, scoreB, winner, action, round, teamA, teamB, teamNames } = body;

    if (!eventId) {
      return new Response(JSON.stringify({ error: 'eventId is required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const event = await db.collection('events').findOne({ id: eventId });

    if (!event) {
      return new Response(JSON.stringify({ error: 'Event not found.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const fixtures = Array.isArray(event.fixtures) ? [...event.fixtures] : [];

    if (action === 'set-team-names') {
      const cleanedNames = (Array.isArray(teamNames) ? teamNames : []).map((name, index) => String(name || '').trim() || `Team ${index + 1}`).slice(0, 32);
      const nameMap = new Map();
      const usedNames = new Set();
      cleanedNames.forEach((name, index) => {
        const baseName = name || `Team ${index + 1}`;
        let uniqueName = baseName;
        let counter = 2;
        while (usedNames.has(uniqueName)) {
          uniqueName = `${baseName} ${counter}`;
          counter += 1;
        }
        usedNames.add(uniqueName);
        nameMap.set(`Team ${index + 1}`, uniqueName);
      });

      const renamedFixtures = fixtures.map((match) => ({
        ...match,
        teamA: match.teamA && nameMap.has(match.teamA) ? nameMap.get(match.teamA) : match.teamA,
        teamB: match.teamB && nameMap.has(match.teamB) ? nameMap.get(match.teamB) : match.teamB,
      }));

      await db.collection('events').updateOne({ id: eventId }, { $set: { teamNames: cleanedNames, fixtures: renamedFixtures } });
      return new Response(JSON.stringify({ success: true, fixtures: renamedFixtures, teamNames: cleanedNames }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (action === 'delete') {
      const filteredFixtures = fixtures.filter((match) => match.id !== matchId);
      await db.collection('events').updateOne({ id: eventId }, { $set: { fixtures: filteredFixtures } });
      return new Response(JSON.stringify({ success: true, fixtures: filteredFixtures }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (action === 'create') {
      if (!teamA || !teamB) {
        return new Response(JSON.stringify({ error: 'Both teams are required to create a fixture.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      const newMatch = {
        id: `match_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        round: round || 'Quarterfinal',
        teamA: teamA.trim(),
        teamB: teamB.trim(),
        scoreA: 0,
        scoreB: 0,
        winner: '',
        status: 'Scheduled',
        matchNumber: fixtures.length + 1,
      };

      fixtures.push(newMatch);
      await db.collection('events').updateOne({ id: eventId }, { $set: { fixtures } });
      return new Response(JSON.stringify({ success: true, fixtures }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (!matchId) {
      return new Response(JSON.stringify({ error: 'matchId is required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const matchIndex = fixtures.findIndex((m) => m.id === matchId);

    if (matchIndex === -1) {
      return new Response(JSON.stringify({ error: 'Match not found.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const targetMatch = fixtures[matchIndex];
    targetMatch.scoreA = Number(scoreA) || 0;
    targetMatch.scoreB = Number(scoreB) || 0;
    targetMatch.winner = winner || (targetMatch.scoreA > targetMatch.scoreB ? targetMatch.teamA : targetMatch.teamB);
    targetMatch.status = 'Completed';

    if (targetMatch.nextMatchId && targetMatch.nextMatchSlot && targetMatch.winner) {
      const nextMatch = fixtures.find((m) => m.id === targetMatch.nextMatchId);
      if (nextMatch) {
        nextMatch[targetMatch.nextMatchSlot] = targetMatch.winner;
      }
    }

    await db.collection('events').updateOne({ id: eventId }, { $set: { fixtures } });

    return new Response(JSON.stringify({ success: true, fixtures }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to update fixture.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
