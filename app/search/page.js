import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import { IconSearch, IconFile } from '@/components/icons';
import prisma from '@/lib/prisma';

async function getData(searchParams) {
  const q = searchParams?.q || '';
  const page = parseInt(searchParams?.page || '1');
  const limit = 12;
  const [posts, total, categories] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'published', OR: [{ title: { contains: q } }, { content: { contains: q } }, { excerpt: { contains: q } }] },
      include: { category: true, _count: { select: { likes: true, comments: true } } },
      orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit,
    }),
    prisma.post.count({ where: { status: 'published', OR: [{ title: { contains: q } }, { content: { contains: q } }, { excerpt: { contains: q } }] } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);
  return { q, posts, total, pages: Math.ceil(total / limit), page, categories };
}

export default async function SearchPage({ searchParams }) {
  const { q, posts, pages, page, categories } = await getData(searchParams);

  return (
    <>
      <Header categories={categories} />
      <main className="container-wide py-8 page-enter">
        <h1 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
          <IconSearch className="w-5 h-5 text-emerald-600" /> সার্চ ফলাফল
        </h1>
        <p className="text-gray-500 text-sm mb-8">{q ? `"${q}" — ${posts.length}টি ফলাফল` : 'সার্চ বক্সে লিখুন'}</p>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        ) : q ? (
          <div className="text-center py-24 text-gray-400">
            <IconSearch className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">কোনো ফলাফল নেই</p>
          </div>
        ) : null}
        <Pagination page={page} pages={pages} path={`/search?q=${encodeURIComponent(q)}`} />
      </main>
      <Footer />
    </>
  );
}
