import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'hooperzclub-dev-secret-change-me';

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
