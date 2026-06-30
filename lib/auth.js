import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('Please define JWT_SECRET in your .env');
}

export function signToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

export function verifyAdminToken(token) {
  const verified = verifyToken(token);
  if (!verified || !verified.admin) {
    return null;
  }
  return verified;
}
