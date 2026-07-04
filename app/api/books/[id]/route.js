import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req, { params }) {
  const id = parseInt(params.id);
  const book = await prisma.book.findUnique({ where: { id }, include: { posts: { where: { status: 'published' }, orderBy: { createdAt: 'desc' }, take: 20 } } });
  if (!book) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ book });
}

export const PUT = requireAdmin(async (req, { params }) => {
  try {
    const id = parseInt(params.id);
    const data = await req.json();
    const book = await prisma.book.update({ where: { id }, data });
    return NextResponse.json({ book });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
});

export const DELETE = requireAdmin(async (req, { params }) => {
  try {
    const id = parseInt(params.id);
    await prisma.post.updateMany({ where: { bookId: id }, data: { bookId: null } });
    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
});
