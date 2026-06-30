import { verifyToken } from '../../../../lib/auth.js';

export async function POST(request) {
  const body = await request.json();
  const { token } = body;

  if (!token) {
    return new Response(JSON.stringify({ valid: false }), { status: 400 });
  }

  const verified = verifyToken(token);
  if (!verified) {
    return new Response(JSON.stringify({ valid: false }), { status: 401 });
  }

  return new Response(JSON.stringify({ valid: true, user: verified }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
