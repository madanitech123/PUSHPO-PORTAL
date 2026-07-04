import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import { IconFile } from '@/components/icons';
import prisma from '@/lib/prisma';

async function getData(searchParams) {
  const page = parseInt(searchParams?.page || '1');
  const limit = 12;
  const skip = (page - 1) * limit;
  const [posts, total, categories] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'published' },
      include: { category: true, _count: { select: { likes: true, comments: true } } },
      orderBy: { createdAt: 'desc' }, skip, take: limit,
    }),
    prisma.post.count({ where: { status: 'published' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);
  return { posts, total, pages: Math.ceil(total / limit), page, categories };
}

export default async function PostsPage({ searchParams }) {
  const { posts, pages, page, categories } = await getData(searchParams);

  return (
    <>
      <Header categories={categories} />
      <main className="container-wide py-8 page-enter">
        <h1 className="text-lg font-bold text-gray-800 section-title flex items-center gap-2 mb-8">
          <IconFile className="w-5 h-5 text-emerald-600" /> সব পোস্ট
        </h1>
        {posts.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <IconFile className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">কোনো পোস্ট নেই</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )}
        <Pagination page={page} pages={pages} path="/posts" />
      </main>
      <Footer />
    </>
  );
}
