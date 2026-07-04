import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createSlug } from '@/lib/utils';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json({ categories });
}

export const POST = requireAdmin(async (req) => {
  try {
    const { name } = await req.json();
    const slug = createSlug(name);
    const category = await prisma.category.create({ data: { name, slug } });
    return NextResponse.json({ category }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
});

export const DELETE = requireAdmin(async (req) => {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await prisma.post.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
});
