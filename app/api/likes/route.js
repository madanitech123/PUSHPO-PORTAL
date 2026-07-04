import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const postId = parseInt(searchParams.get('postId'));
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 });

  const count = await prisma.like.count({ where: { postId } });
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '0.0.0.0';
  const userLiked = await prisma.like.findUnique({ where: { ipAddress_postId: { ipAddress: ip, postId } } });

  return NextResponse.json({ count, userLiked: !!userLiked });
}

export async function POST(req) {
  try {
    const { postId } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '0.0.0.0';

    const existing = await prisma.like.findUnique({ where: { ipAddress_postId: { ipAddress: ip, postId: parseInt(postId) } } });
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return NextResponse.json({ liked: false });
    }

    await prisma.like.create({ data: { ipAddress: ip, postId: parseInt(postId) } });
    return NextResponse.json({ liked: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
