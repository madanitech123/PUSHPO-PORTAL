import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';

export const GET = requireSuperAdmin(async () => {
  const admins = await prisma.admin.findMany({ select: { id: true, name: true, email: true, role: true, image: true, createdAt: true } });
  return NextResponse.json({ admins });
});

export const POST = requireSuperAdmin(async (req) => {
  try {
    const { name, email, password, role } = await req.json();
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    const hashed = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: { name, email, password: hashed, role: role || 'admin' },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json({ admin }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
});
