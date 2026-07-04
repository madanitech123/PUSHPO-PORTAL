import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';
import { IconTag, IconUser, IconCalendar, IconEye, IconBookOpen, IconChevronLeft, IconFile } from '@/components/icons';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

async function getPost(slug) {
  const post = await prisma.post.findUnique({
    where: { slug, status: 'published' },
    include: { category: true, book: true, admin: { select: { name: true } } },
  });
  if (!post) return null;
  await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
  const related = await prisma.post.findMany({
    where: { status: 'published', categoryId: post.categoryId, id: { not: post.id } },
    take: 4, orderBy: { createdAt: 'desc' },
    select: { title: true, slug: true, image: true, createdAt: true },
  });
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return { post, related, categories };
}

export default async function PostPage({ params }) {
  const data = await getPost(params.slug);
  if (!data) notFound();
  const { post, related, categories } = data;

  return (
    <>
      <Header categories={categories} />
      <main className="container-wide py-8 page-enter">
        <article className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {post.category && (
              <Link href={`/category/${post.category.slug}`} className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium hover-soft">
                <IconTag className="w-3.5 h-3.5" /> {post.category.name}
              </Link>
            )}
            {post.book && (
              <Link href={`/books/${post.book.slug}`} className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium hover-soft">
                <IconBookOpen className="w-3.5 h-3.5" /> {post.book.title}
              </Link>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 flex-wrap">
            <span className="flex items-center gap-1.5"><IconUser className="w-4 h-4" /> {post.admin.name}</span>
            <span className="flex items-center gap-1.5"><IconCalendar className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString('bn-BD')}</span>
            <span className="flex items-center gap-1.5"><IconEye className="w-4 h-4" /> {post.views} ভিউ</span>
          </div>

          {post.image && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-md">
              <img src={post.image} alt={post.title} className="w-full max-h-96 object-cover" />
            </div>
          )}

          <div className="glass rounded-2xl p-6 md:p-8 lg:p-10">
            <div className="prose max-w-none text-gray-800 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-emerald-50">
            <LikeButton postId={post.id} showComment />
            <Link href="/" className="text-sm text-gray-400 hover:text-emerald-600 transition flex items-center gap-1.5 ml-auto">
              <IconChevronLeft className="w-4 h-4" /> হোমপেজ
            </Link>
          </div>

          <CommentSection postId={post.id} />
        </article>

        {related.length > 0 && (
          <section className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-base font-bold text-gray-800 section-title flex items-center gap-2 mb-6">
              <IconFile className="w-5 h-5 text-emerald-600" /> সম্পর্কিত পোস্ট
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(r => (
                <Link key={r.slug} href={`/posts/${r.slug}`} className="glass-card p-3">
                  {r.image ? (
                    <img src={r.image} className="w-full h-24 object-cover rounded-lg mb-2" />
                  ) : (
                    <div className="w-full h-24 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg mb-2 flex items-center justify-center">
                      <IconFile className="w-6 h-6 text-emerald-300" />
                    </div>
                  )}
                  <h4 className="text-sm font-medium text-gray-700 line-clamp-2">{r.title}</h4>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
