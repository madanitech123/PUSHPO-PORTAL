import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { IconBook, IconUser, IconFile, IconCalendar } from '@/components/icons';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getData(slug) {
  const book = await prisma.book.findUnique({
    where: { slug },
    include: { posts: { where: { status: 'published' }, include: { category: true, _count: { select: { likes: true, comments: true } } }, orderBy: { createdAt: 'desc' } } },
  });
  if (!book) return null;
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return { book, categories };
}

export default async function BookDetailPage({ params }) {
  const data = await getData(params.slug);
  if (!data) notFound();
  const { book, categories } = data;

  return (
    <>
      <Header categories={categories} />
      <main className="container-wide py-8 page-enter">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-card p-0 border-0 overflow-hidden">
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="w-full" />
              ) : (
                <div className="w-full aspect-[3/4] gradient-bg flex items-center justify-center">
                  <IconBook className="w-20 h-20 text-white/40" />
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>
              {book.author && (
                <p className="text-emerald-700 font-medium flex items-center gap-2 mb-2">
                  <IconUser className="w-4 h-4" /> {book.author}
                </p>
              )}
              {book.pages && <p className="text-sm text-gray-500 mb-2 flex items-center gap-2"><IconFile className="w-3.5 h-3.5" /> {book.pages} পৃষ্ঠা</p>}
              {book.description && (
                <div className="glass rounded-2xl p-6 mt-4">
                  <p className="text-gray-700 leading-relaxed text-sm">{book.description}</p>
                </div>
              )}
              <div className="mt-6 flex items-center gap-3">
                <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                  <IconFile className="w-4 h-4" /> {book.posts.length}টি পোস্ট
                </span>
              </div>
            </div>
          </div>

          {book.posts.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-gray-800 section-title flex items-center gap-2 mb-6">
                <IconFile className="w-5 h-5 text-emerald-600" /> এই বই সম্পর্কিত পোস্ট
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {book.posts.map(post => <PostCard key={post.id} post={post} />)}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
