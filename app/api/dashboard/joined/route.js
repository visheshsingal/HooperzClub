import clientPromise from '../../../../lib/mongodb.js';

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
    const { eventId, participantName, position } = body;

    if (!eventId) {
      return new Response(JSON.stringify({ error: 'eventId is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');

    // 1. Fetch Event to check capacity & team format
    const event = await db.collection('events').findOne({ id: eventId });
    const teamCount = Math.max(2, Number(event?.teamCount || event?.teams) || 4);
    const playersPerTeam = getPlayersPerTeam(event?.format || '3v3');
    const maxCapacity = teamCount * playersPerTeam;

    // 2. Check current registrations for this event
    const existingJoined = await db.collection('joined').find({ eventId }).toArray();
    if (existingJoined.length >= maxCapacity) {
      return new Response(
        JSON.stringify({ error: 'Registration Full! This Basketball event has reached maximum capacity.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Random Team Assignment among teams with open slots
    const allTeams = Array.from({ length: teamCount }, (_, i) => `Team ${i + 1}`);
    const teamCountsMap = {};
    allTeams.forEach((t) => (teamCountsMap[t] = 0));
    existingJoined.forEach((j) => {
      if (j.assignedTeam && teamCountsMap[j.assignedTeam] !== undefined) {
        teamCountsMap[j.assignedTeam]++;
      }
    });

    const openTeams = allTeams.filter((t) => teamCountsMap[t] < playersPerTeam);
    const assignedTeam = openTeams.length > 0
      ? openTeams[Math.floor(Math.random() * openTeams.length)]
      : allTeams[Math.floor(Math.random() * allTeams.length)];

    const joined = {
      eventId,
      participantName: participantName || 'Basketball Baller',
      position: position || 'Guard',
      assignedTeam,
      joinedAt: new Date().toISOString(),
    };

    await db.collection('joined').insertOne(joined);

    return new Response(JSON.stringify(joined), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to save registration.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return new Response(JSON.stringify({ error: 'eventId is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');
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
