import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import { IconTag, IconFile } from '@/components/icons';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getData(slug, searchParams) {
  const page = parseInt(searchParams?.page || '1');
  const limit = 12;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return null;
  const [posts, total, categories] = await Promise.all([
    prisma.post.findMany({
      where: { categoryId: category.id, status: 'published' },
      include: { category: true, _count: { select: { likes: true, comments: true } } },
      orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit,
    }),
    prisma.post.count({ where: { categoryId: category.id, status: 'published' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);
  return { category, posts, total, pages: Math.ceil(total / limit), page, categories };
}

export default async function CategoryPage({ params, searchParams }) {
  const data = await getData(params.slug, searchParams);
  if (!data) notFound();
  const { category, posts, pages, page, categories } = data;

  return (
    <>
      <Header categories={categories} />
      <main className="container-wide py-8 page-enter">
        <h1 className="text-lg font-bold text-gray-800 section-title flex items-center gap-2 mb-8">
          <IconTag className="w-5 h-5 text-emerald-600" /> {category.name}
        </h1>
        {posts.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <IconFile className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">এই ক্যাটাগরিতে কোনো পোস্ট নেই</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}
        <Pagination page={page} pages={pages} path={`/category/${params.slug}`} />
      </main>
      <Footer />
    </>
  );
}
