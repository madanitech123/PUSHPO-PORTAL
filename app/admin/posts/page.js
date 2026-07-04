'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = () => {
    fetch('/api/posts?status=all&limit=20&page=' + page).then(r => r.json()).then(d => {
      setPosts(d.posts || []);
      setPages(d.pages || 1);
    });
  };

  useEffect(() => { load(); }, [page]);

  const del = async (id) => {
    if (!confirm('পোস্টটি ডিলিট করবেন?')) return;
    await fetch('/api/posts/' + id, { method: 'DELETE' });
    load();
  };

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📝 পোস্টসমূহ</h1>
        <Link href="/admin/posts/new" className="btn-primary text-xs">+ নতুন পোস্ট</Link>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50">
              <tr>
                <th className="text-left p-4 text-gray-600 font-medium">শিরোনাম</th>
                <th className="text-left p-4 text-gray-600 font-medium hidden md:table-cell">স্ট্যাটাস</th>
                <th className="text-left p-4 text-gray-600 font-medium hidden md:table-cell">ভিউ</th>
                <th className="text-left p-4 text-gray-600 font-medium hidden md:table-cell">তারিখ</th>
                <th className="text-left p-4 text-gray-600 font-medium">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-t border-emerald-50 hover-soft cursor-pointer">
                  <td className="p-4">
                    <p className="font-medium text-gray-800 line-clamp-1">{post.title}</p>
                    <p className="text-xs text-gray-400">{post.category?.name || 'ক্যাটাগরি নেই'}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${post.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {post.status === 'published' ? 'প্রকাশিত' : 'ড্রাফট'}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell text-gray-500">{post.views}</td>
                  <td className="p-4 hidden md:table-cell text-gray-500 text-xs">{new Date(post.createdAt).toLocaleDateString('bn-BD')}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/posts/${post.id}/edit`} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover-soft">এডিট</Link>
                      <button onClick={() => del(post.id)} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-medium hover-soft">ডিলিট</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {posts.length === 0 && <p className="text-center text-gray-400 py-16">কোনো পোস্ট নেই</p>}
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-xl text-sm transition-all ${p === page ? 'gradient-bg text-white shadow-sm' : 'bg-white border-2 border-emerald-100 text-gray-600 hover-soft'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
