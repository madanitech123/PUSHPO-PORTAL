'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';

export default function EditPost() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', content: '', image: '', type: 'text', status: 'draft', featured: false, featuredOrder: 0, categoryId: '', bookId: '' });
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/books').then(r => r.json()),
      fetch('/api/posts/' + id).then(r => r.json()),
    ]).then(([catData, bookData, postData]) => {
      setCategories(catData.categories || []);
      setBooks(bookData.books || []);
      if (postData.post) {
        const p = postData.post;
        setForm({ title: p.title, content: p.content, image: p.image || '', type: p.type, status: p.status, featured: p.featured, featuredOrder: p.featuredOrder || 0, categoryId: p.categoryId?.toString() || '', bookId: p.bookId?.toString() || '' });
      }
      setLoading(false);
    });
  }, [id]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/posts/' + id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) router.push('/admin/posts');
  };

  if (loading) return <div className="text-center py-16"><p className="text-4xl animate-pulse">🌸</p><p className="text-gray-400 mt-2">লোড হচ্ছে...</p></div>;

  return (
    <div className="page-enter">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">✏️ পোস্ট এডিট</h1>
      <form onSubmit={save} className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-6 lg:p-8 space-y-5 max-w-4xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">শিরোনাম *</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="w-full border-2 border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">টাইপ</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full border-2 border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
              <option value="text">টেক্সট</option>
              <option value="image">ইমেজ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">স্ট্যাটাস</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full border-2 border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
              <option value="draft">ড্রাফট</option>
              <option value="published">প্রকাশিত</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ক্যাটাগরি</label>
            <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className="w-full border-2 border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
              <option value="">কোনটি নয়</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">বই</label>
            <select value={form.bookId} onChange={e => setForm(f => ({ ...f, bookId: e.target.value }))} className="w-full border-2 border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
              <option value="">কোনটি নয়</option>
              {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="rounded text-emerald-600" />
          <label htmlFor="featured" className="text-sm text-gray-700">ফিচার্ড</label>
        </div>
        {form.featured && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ফিচার্ড অর্ডার (বড় নাম্বার = আগে দেখাবে)</label>
            <input type="number" min="0" max="99" value={form.featuredOrder} onChange={e => setForm(f => ({ ...f, featuredOrder: parseInt(e.target.value) || 0 }))} className="w-24 border-2 border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition text-sm" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">ফিচার্ড ইমেজ</label>
          <ImageUploader current={form.image} onUpload={(url) => setForm(f => ({ ...f, image: url }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">কন্টেন্ট *</label>
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={12} required className="w-full border-2 border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition font-mono text-sm" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'সেভ হচ্ছে...' : 'আপডেট করুন'}</button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border-2 border-emerald-100 rounded-xl text-sm hover-soft text-gray-600 bg-white">বাতিল</button>
        </div>
      </form>
    </div>
  );
}
