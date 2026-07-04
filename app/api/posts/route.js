import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSlug, stripHtml } from '@/lib/utils';
import { requireAdmin } from '@/lib/auth';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const q = searchParams.get('q');
  const featured = searchParams.get('featured');
  const skip = (page - 1) * limit;

  const where = {};
  if (category) where.category = { slug: category };
  if (status) where.status = status;
  else where.status = 'published';
  if (featured) where.featured = true;
  if (q) where.OR = [{ title: { contains: q } }, { content: { contains: q } }];

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { category: true, book: { select: { title: true, slug: true } }, admin: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({ posts, total, pages: Math.ceil(total / limit), page });
}

export const POST = requireAdmin(async (req) => {
  try {
    const { title, content, excerpt, image, type, status, featured, categoryId, bookId } = await req.json();
    const slug = createSlug(title);
    const existing = await prisma.post.findUnique({ where: { slug } });
    const finalSlug = existing ? slug + '-' + Date.now() : slug;

    const post = await prisma.post.create({
      data: {
        title, slug: finalSlug, content, excerpt: excerpt || stripHtml(content),
        image, type: type || 'text', status: status || 'draft', featured: featured || false,
        categoryId: categoryId ? parseInt(categoryId) : null,
        bookId: bookId ? parseInt(bookId) : null,
        adminId: req.admin.id,
      },
      include: { category: true },
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
});
