const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('./prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'news-portal-secret-key-change-in-production';

function signToken(admin) {
  return jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function getTokenFromCookies(req) {
  const cookie = req.cookies.get('token')?.value;
  return cookie || null;
}

async function getAdminFromRequest(req) {
  const token = getTokenFromCookies(req);
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;
  const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
  return admin;
}

function requireAdmin(handler) {
  return async (req, context) => {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    req.admin = admin;
    return handler(req, context);
  };
}

function requireSuperAdmin(handler) {
  return async (req, context) => {
    const admin = await getAdminFromRequest(req);
    if (!admin || admin.role !== 'superadmin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    req.admin = admin;
    return handler(req, context);
  };
}

module.exports = { signToken, verifyToken, getTokenFromCookies, getAdminFromRequest, requireAdmin, requireSuperAdmin, JWT_SECRET };
