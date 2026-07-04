import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import BookCard from '@/components/BookCard';
import { IconHome, IconTag, IconBook, IconChevronRight } from '@/components/icons';
import Link from 'next/link';
import prisma from '@/lib/prisma';

async function getData() {
  const [featured, latest, categories, books] = await Promise.all([
    prisma.post.findMany({ where: { status: 'published', featured: true }, include: { category: true, _count: { select: { likes: true, comments: true } } }, orderBy: { createdAt: 'desc' }, take: 4 }),
    prisma.post.findMany({ where: { status: 'published' }, include: { category: true, _count: { select: { likes: true, comments: true } } }, orderBy: { createdAt: 'desc' }, take: 9 }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.book.findMany({ include: { _count: { select: { posts: true } } }, orderBy: { createdAt: 'desc' }, take: 6 }),
  ]);
  return { featured, latest, categories, books };
}

export default async function HomePage() {
  const { featured, latest, categories, books } = await getData();

  return (
    <>
      <Header categories={categories} />

      {featured.length > 0 && (
        <div className="ticker-wrap">
          <div className="ticker-text">
            {featured.map(p => `◆ ${p.title}  •  `).join(' ')}
          </div>
        </div>
      )}

      <main className="container-wide py-8 page-enter">
        {featured.length > 0 ? (
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <PostCard post={featured[0]} featured />
              </div>
              {featured.slice(1, 3).map(p => (
                <PostCard key={p.id} post={p} featured />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 section-title flex items-center gap-2">
              <IconHome className="w-5 h-5 text-emerald-600" /> সর্বশেষ পোস্ট
            </h2>
            <Link href="/posts" className="btn-primary text-xs">সব দেখুন <IconChevronRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-stagger">
            {latest.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        </section>

        {categories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-bold text-gray-800 section-title flex items-center gap-2 mb-6">
              <IconTag className="w-5 h-5 text-emerald-600" /> ক্যাটাগরি
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="glass border border-emerald-100 text-gray-600 hover:text-emerald-700 px-5 py-2.5 rounded-xl text-sm transition-all duration-300 hover-pop shadow-sm">
                  {cat.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {books.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800 section-title flex items-center gap-2">
                <IconBook className="w-5 h-5 text-emerald-600" /> বইয়ের ক্যাটালগ
              </h2>
              <Link href="/books" className="btn-primary text-xs">সব দেখুন <IconChevronRight className="w-3.5 h-3.5" /></Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {books.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          </section>
        )}

        {!featured.length && !latest.length && (
          <div className="text-center py-24">
            <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconBook className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text mb-2">পুষ্প প্রকাশনে স্বাগতম</h1>
            <p className="text-gray-500 text-sm">শীঘ্রই নতুন কন্টেন্ট আসছে</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
