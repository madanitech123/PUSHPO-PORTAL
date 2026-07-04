import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export const PATCH = requireAdmin(async (req, { params }) => {
  const id = parseInt(params.id);
  const { isApproved } = await req.json();
  const comment = await prisma.comment.update({ where: { id }, data: { isApproved } });
  return NextResponse.json({ comment });
});

export const DELETE = requireAdmin(async (req, { params }) => {
  const id = parseInt(params.id);
  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
