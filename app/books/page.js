import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookCard from '@/components/BookCard';
import { IconBook } from '@/components/icons';
import prisma from '@/lib/prisma';

async function getData() {
  const [books, categories] = await Promise.all([
    prisma.book.findMany({ include: { _count: { select: { posts: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);
  return { books, categories };
}

export default async function BooksPage() {
  const { books, categories } = await getData();

  return (
    <>
      <Header categories={categories} />
      <main className="container-wide py-8 page-enter">
        <div className="text-center mb-10">
          <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-3">
            <IconBook className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-1">বইয়ের ক্যাটালগ</h1>
          <p className="text-gray-500 text-sm">মাসিক আল কলম পুষ্পর প্রকাশিত সমস্ত বই</p>
        </div>
        {books.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <IconBook className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>কোনো বই নেই</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {books.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
