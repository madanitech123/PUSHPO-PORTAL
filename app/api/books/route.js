import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSlug } from '@/lib/utils';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const books = await prisma.book.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ books });
}

export const POST = requireAdmin(async (req) => {
  try {
    const { title, description, coverImage, author, pages, publishedAt } = await req.json();
    const slug = createSlug(title);
    const book = await prisma.book.create({
      data: {
        title, slug, description, coverImage, author,
        pages: pages ? parseInt(pages) : null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        adminId: req.admin.id,
      },
    });
    return NextResponse.json({ book }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
});
