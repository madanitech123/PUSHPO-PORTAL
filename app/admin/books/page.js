'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminBooks() {
  const [books, setBooks] = useState([]);

  const load = () => {
    fetch('/api/books').then(r => r.json()).then(d => setBooks(d.books || []));
  };

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm('বইটি ডিলিট করবেন?')) return;
    await fetch('/api/books/' + id, { method: 'DELETE' });
    load();
  };

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📚 বই</h1>
        <Link href="/admin/books/new" className="btn-primary text-xs">+ নতুন বই</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(book => (
          <div key={book.id} className="card-modern p-4 flex gap-4">
            {book.coverImage ? (
              <img src={book.coverImage} className="w-20 h-28 object-cover rounded-xl" />
            ) : (
              <div className="w-20 h-28 gradient-bg rounded-xl flex items-center justify-center text-3xl">📖</div>
            )}
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{book.title}</h3>
              {book.author && <p className="text-xs text-emerald-600 font-medium">✍️ {book.author}</p>}
              <p className="text-xs text-gray-400 mt-1">📄 {book._count?.posts || 0}টি পোস্ট</p>
              <div className="flex gap-2 mt-3">
                <Link href={`/admin/books/new?id=${book.id}`} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover-soft">এডিট</Link>
                <button onClick={() => del(book.id)} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-medium hover-soft">ডিলিট</button>
              </div>
            </div>
          </div>
        ))}
        {books.length === 0 && <div className="col-span-full text-center py-16 text-gray-400"><p className="text-5xl mb-4">📚</p><p>কোনো বই নেই</p></div>}
      </div>
    </div>
  );
}
