import Link from 'next/link';
import { IconChevronLeft, IconChevronRight } from './icons';

export default function Pagination({ page, pages, path }) {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-10 animate-fade-up">
      {page > 1 && (
        <Link href={`${path}${path.includes('?') ? '&' : '?'}page=${page - 1}`} className="flex items-center gap-1 px-4 py-2.5 border border-emerald-100 rounded-xl text-sm hover-soft text-gray-600 bg-white/70 glass">
          <IconChevronLeft className="w-4 h-4" /> আগে
        </Link>
      )}
      {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
        <Link key={p} href={`${path}${path.includes('?') ? '&' : '?'}page=${p}`} className={`px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${p === page ? 'gradient-bg text-white shadow-md' : 'border border-emerald-100 bg-white/70 text-gray-600 hover-soft glass'}`}>
          {p}
        </Link>
      ))}
      {page < pages && (
        <Link href={`${path}${path.includes('?') ? '&' : '?'}page=${page + 1}`} className="flex items-center gap-1 px-4 py-2.5 border border-emerald-100 rounded-xl text-sm hover-soft text-gray-600 bg-white/70 glass">
          পরে <IconChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
