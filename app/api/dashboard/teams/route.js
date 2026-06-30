import { ObjectId } from 'mongodb';
import clientPromise from '../../../../lib/mongodb.js';

const serializeTeam = (team) => ({
  ...team,
  _id: team._id.toString(),
  createdAt: team.createdAt instanceof Date ? team.createdAt.toISOString() : team.createdAt,
});

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const teams = await db.collection('teams').find({}).sort({ createdAt: -1 }).toArray();
    return new Response(JSON.stringify(teams.map(serializeTeam)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to load teams.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, sport, players } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: 'Team name is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const team = {
      name,
      sport,
      players: players ?? [],
      createdAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const result = await db.collection('teams').insertOne(team);

    return new Response(JSON.stringify(serializeTeam({ ...team, _id: result.insertedId })), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to save team.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { teamId, name, sport, players } = body;

    if (!teamId || !name) {
      return new Response(JSON.stringify({ error: 'teamId and name are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const result = await db.collection('teams').findOneAndUpdate(
      { _id: new ObjectId(teamId) },
      { $set: { name, sport, players: players ?? [] } },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return new Response(JSON.stringify({ error: 'Team not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(serializeTeam(result.value)), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to update team.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return new Response(JSON.stringify({ error: 'teamId is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    await db.collection('teams').deleteOne({ _id: new ObjectId(teamId) });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to delete team.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
