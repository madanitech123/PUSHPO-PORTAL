import Link from 'next/link';
import { IconBook, IconFile, IconUser } from './icons';

export default function BookCard({ book }) {
  return (
    <Link href={`/books/${book.slug}`} className="block glass-card group">
      {book.coverImage ? (
        <div className="h-52 overflow-hidden">
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
        </div>
      ) : (
        <div className="h-52 gradient-bg flex items-center justify-center">
          <IconBook className="w-14 h-14 text-white/40 group-hover:scale-110 transition-transform duration-500" />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-1.5 line-clamp-2 group-hover:text-emerald-700 transition">{book.title}</h3>
        {book.author && (
          <p className="text-emerald-600 text-sm flex items-center gap-1.5">
            <IconUser className="w-3.5 h-3.5" /> {book.author}
          </p>
        )}
        {book._count && (
          <p className="text-gray-400 text-xs mt-2 flex items-center gap-1.5">
            <IconFile className="w-3 h-3" /> {book._count.posts}টি পোস্ট
          </p>
        )}
      </div>
    </Link>
  );
}
