import clientPromise from '../../../../lib/mongodb.js';
import { ObjectId } from 'mongodb';

function getPlayersPerTeam(format) {
  if (format === '1v1') return 1;
  if (format === '2v2') return 2;
  if (format === '3v3') return 3;
  if (format === '5v5') return 5;
  return 3;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const joined = await db.collection('joined').find({}).sort({ joinedAt: -1 }).toArray();
    return new Response(JSON.stringify(joined), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to load joined entries.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { eventId, participantName, position, friends = [] } = body;

    if (!eventId) {
      return new Response(JSON.stringify({ error: 'eventId is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');

    // 1. Fetch Event to check status, capacity & format
    const event = await db.collection('events').findOne({ id: eventId });
    if (!event) {
      return new Response(JSON.stringify({ error: 'Event not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if tournament has started or completed
    const isStarted = event.start && new Date(event.start) < new Date();
    const isClosed = event.status === 'In Progress' || event.status === 'Completed' || event.status === 'Closed';

    if (isStarted || isClosed) {
      return new Response(
        JSON.stringify({ error: 'Registration Closed! This tournament has already started or is completed.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const teamCount = Math.max(2, Number(event.teamCount || event.teams) || 4);
    const playersPerTeam = getPlayersPerTeam(event.format || '3v3');
    const maxCapacity = teamCount * playersPerTeam;

    // Total squad size (main user + friends)
    const validFriends = (Array.isArray(friends) ? friends : []).filter((f) => f.name && f.name.trim());
    const totalSquadSize = 1 + validFriends.length;

    if (totalSquadSize > playersPerTeam) {
      return new Response(
        JSON.stringify({ error: `Your group of ${totalSquadSize} exceeds the max ${playersPerTeam} players per team for this ${event.format || '3v3'} format.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Check current registrations for this event
    const existingJoined = await db.collection('joined').find({ eventId }).toArray();
    if (existingJoined.length + totalSquadSize > maxCapacity) {
      return new Response(
        JSON.stringify({ error: `Not enough spots left! Only ${maxCapacity - existingJoined.length} spot(s) remaining.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Find a team with at least totalSquadSize open slots
    const allTeams = Array.from({ length: teamCount }, (_, i) => `Team ${i + 1}`);
    const teamCountsMap = {};
    allTeams.forEach((t) => (teamCountsMap[t] = 0));
    existingJoined.forEach((j) => {
      if (j.assignedTeam && teamCountsMap[j.assignedTeam] !== undefined) {
        teamCountsMap[j.assignedTeam]++;
      }
    });

    const openTeamsForGroup = allTeams.filter((t) => playersPerTeam - teamCountsMap[t] >= totalSquadSize);

    if (openTeamsForGroup.length === 0) {
      return new Response(
        JSON.stringify({ error: `No single team has ${totalSquadSize} open spots available together.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const assignedTeam = openTeamsForGroup[Math.floor(Math.random() * openTeamsForGroup.length)];
    const timestamp = new Date().toISOString();

    // Group players to insert (Main user + friends)
    const entriesToInsert = [
      {
        eventId,
        participantName: participantName || 'Basketball Baller',
        position: position || 'Guard',
        assignedTeam,
        joinedAt: timestamp,
      },
      ...validFriends.map((f) => ({
        eventId,
        participantName: f.name.trim(),
        position: f.position || 'Guard',
        assignedTeam,
        joinedAt: timestamp,
      })),
    ];

    await db.collection('joined').insertMany(entriesToInsert);

    return new Response(
      JSON.stringify({
        success: true,
        assignedTeam,
        squadSize: totalSquadSize,
        joined: entriesToInsert[0],
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to save registration.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, entryId, assignedTeam } = body;

    if (!entryId || action !== 'reassign') {
      return new Response(JSON.stringify({ error: 'entryId and action are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!assignedTeam) {
      return new Response(JSON.stringify({ error: 'assignedTeam is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const result = await db.collection('joined').updateOne(
      { _id: new ObjectId(entryId) },
      { $set: { assignedTeam: assignedTeam.trim() || assignedTeam } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'Joined entry not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, assignedTeam }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to update team assignment.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { searchParams } = new URL(request.url);
    const eventId = body.eventId || searchParams.get('eventId');
    const entryId = body.entryId || searchParams.get('entryId');

    if (!eventId && !entryId) {
      return new Response(JSON.stringify({ error: 'eventId or entryId is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');

    if (entryId) {
      await db.collection('joined').deleteOne({ _id: new ObjectId(entryId) });
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const latest = await db.collection('joined').find({ eventId }).sort({ joinedAt: -1 }).limit(1).toArray();

    if (latest.length === 0) {
      return new Response(JSON.stringify({ error: 'No joined application found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.collection('joined').deleteOne({ _id: latest[0]._id });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to delete joined entry.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
