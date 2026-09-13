import bcrypt from 'bcryptjs';
import clientPromise from '../../../../lib/mongodb.js';
import { signToken } from '../../../../lib/auth.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return new Response(JSON.stringify({ error: 'Email and OTP are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const client = await clientPromise;
    if (!client) {
      return new Response(JSON.stringify({ error: 'Database unavailable. Please try again later.' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = client.db('hooperzclub');
    const users = db.collection('users');
    const user = await users.findOne({ email: String(email).toLowerCase().trim() });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    if (user.emailVerified) {
      const token = signToken({ userId: user._id.toString(), email: user.email, name: user.name });
      return new Response(JSON.stringify({ message: 'Email already verified.', token }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!user.otpHash || !user.otpExpiresAt || new Date(user.otpExpiresAt).getTime() < Date.now()) {
      return new Response(JSON.stringify({ error: 'Verification code expired. Please sign up again.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isValidOtp = await bcrypt.compare(String(otp).trim(), user.otpHash);
    if (!isValidOtp) {
      return new Response(JSON.stringify({ error: 'Invalid verification code.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          emailVerified: true,
          otpHash: '',
          otpExpiresAt: null,
        },
      }
    );

    const token = signToken({ userId: user._id.toString(), email: user.email, name: user.name, credits: user.credits || 99 });

    return new Response(JSON.stringify({ message: 'Email verified successfully.', token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Server error. Please try again.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
