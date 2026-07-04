import { NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(req) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ admin: null });
  return NextResponse.json({ admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role, image: admin.image } });
}
