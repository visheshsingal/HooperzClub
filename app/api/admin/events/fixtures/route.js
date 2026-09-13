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
    const { eventId, matchId, scoreA, scoreB, winner } = await request.json();

    if (!eventId || !matchId) {
      return new Response(JSON.stringify({ error: 'eventId and matchId are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const event = await db.collection('events').findOne({ id: eventId });

    if (!event) {
      return new Response(JSON.stringify({ error: 'Event not found.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const fixtures = event.fixtures || [];
    const matchIndex = fixtures.findIndex((m) => m.id === matchId);

    if (matchIndex === -1) {
      return new Response(JSON.stringify({ error: 'Match not found.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const targetMatch = fixtures[matchIndex];
    targetMatch.scoreA = Number(scoreA) || 0;
    targetMatch.scoreB = Number(scoreB) || 0;
    targetMatch.winner = winner || (targetMatch.scoreA > targetMatch.scoreB ? targetMatch.teamA : targetMatch.teamB);
    targetMatch.status = 'Completed';

    // Advance winner to next match if applicable
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
