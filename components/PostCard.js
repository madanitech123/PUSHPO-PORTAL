import Link from 'next/link';
import { IconHeart, IconComment, IconEye, IconCalendar, IconBookOpen, IconTag } from './icons';

export default function PostCard({ post, featured }) {
  if (featured) {
    return (
      <Link href={`/posts/${post.slug}`} className="block relative h-64 md:h-80 rounded-2xl overflow-hidden group glass-card border-0">
        <div className="absolute inset-0 featured-gradient z-10" />
        {post.image ? (
          <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center">
            <IconBookOpen className="w-16 h-16 text-white/30" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transition-all duration-300 group-hover:translate-y-[-4px]">
          {post.category && (
            <span className="bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full mb-3 inline-block border border-white/10">
              {post.category.name}
            </span>
          )}
          <h2 className="text-white text-xl md:text-2xl font-bold leading-tight drop-shadow-sm">{post.title}</h2>
          {post.excerpt && <p className="text-emerald-100/80 text-sm mt-2 line-clamp-2">{post.excerpt}</p>}
          <div className="flex items-center gap-4 mt-3 text-xs text-emerald-100/70">
            <span className="flex items-center gap-1.5"><IconCalendar className="w-3.5 h-3.5" /> {new Date(post.createdAt).toLocaleDateString('bn-BD')}</span>
            <span className="flex items-center gap-1.5"><IconEye className="w-3.5 h-3.5" /> {post.views || 0}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/posts/${post.slug}`} className="block glass-card group">
      <div className="relative overflow-hidden">
        {post.image ? (
          <div className="h-44 overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
          </div>
        ) : (
          <div className="h-44 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
            <IconBookOpen className="w-10 h-10 text-emerald-300" />
          </div>
        )}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
          <span className="bg-white/80 backdrop-blur-sm text-emerald-700 text-xs px-3 py-1.5 rounded-full shadow-sm border border-white/50">
            {post.category?.name || 'পোস্ট'}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-emerald-600 text-xs font-medium bg-emerald-50/80 px-2.5 py-1 rounded-full flex items-center gap-1">
            {post.category?.name || 'সাধারণ'}
          </span>
          <span className="text-gray-400 text-xs">{new Date(post.createdAt).toLocaleDateString('bn-BD')}</span>
        </div>
        <h2 className="font-bold text-gray-800 mb-2 line-clamp-2 leading-snug text-base group-hover:text-emerald-700 transition">{post.title}</h2>
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
        <div className="ig-action-bar flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
          <span className="flex items-center gap-1.5 text-xs text-gray-400"><IconHeart className="w-3.5 h-3.5" /> {post._count?.likes || 0}</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400"><IconComment className="w-3.5 h-3.5" /> {post._count?.comments || 0}</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400 ml-auto"><IconEye className="w-3.5 h-3.5" /> {post.views || 0}</span>
        </div>
      </div>
    </Link>
  );
}
