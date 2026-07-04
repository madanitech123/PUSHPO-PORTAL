import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(req, { params }) {
  const id = parseInt(params.id);
  const post = await prisma.post.findUnique({ where: { id }, include: { category: true, book: true, admin: { select: { name: true } } } });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (!req.admin) {
    await prisma.post.update({ where: { id }, data: { views: { increment: 1 } } });
  }

  return NextResponse.json({ post });
}

export const PUT = requireAdmin(async (req, { params }) => {
  try {
    const id = parseInt(params.id);
    const { title, content, excerpt, image, type, status, featured, categoryId, bookId } = await req.json();
    const data = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (image !== undefined) data.image = image;
    if (type !== undefined) data.type = type;
    if (status !== undefined) data.status = status;
    if (featured !== undefined) data.featured = featured;
    if (categoryId !== undefined) data.categoryId = categoryId ? parseInt(categoryId) : null;
    if (bookId !== undefined) data.bookId = bookId ? parseInt(bookId) : null;

    const post = await prisma.post.update({ where: { id }, data, include: { category: true } });
    return NextResponse.json({ post });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
});

export const DELETE = requireAdmin(async (req, { params }) => {
  try {
    const id = parseInt(params.id);
    await prisma.comment.deleteMany({ where: { postId: id } });
    await prisma.like.deleteMany({ where: { postId: id } });
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
});
