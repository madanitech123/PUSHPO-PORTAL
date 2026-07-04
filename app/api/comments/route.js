import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');
  const approved = searchParams.get('approved');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;

  const where = {};
  if (postId) where.postId = parseInt(postId);
  if (approved === 'true') where.isApproved = true;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      include: { post: { select: { title: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.comment.count({ where }),
  ]);

  return NextResponse.json({ comments, total, pages: Math.ceil(total / limit) });
}

export async function POST(req) {
  try {
    const { content, author, email, postId } = await req.json();
    const comment = await prisma.comment.create({
      data: { content, author, email, postId: parseInt(postId) },
    });
    return NextResponse.json({ comment }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export const DELETE = requireAdmin(async (req) => {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await prisma.comment.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
