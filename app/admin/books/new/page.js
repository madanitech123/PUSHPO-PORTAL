'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';

export default function NewBook() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const [form, setForm] = useState({ title: '', description: '', coverImage: '', author: '', pages: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!editId);

  useEffect(() => {
    if (editId) {
      fetch('/api/books/' + editId).then(r => r.json()).then(d => {
        if (d.book) {
          const b = d.book;
          setForm({ title: b.title, description: b.description || '', coverImage: b.coverImage || '', author: b.author || '', pages: b.pages?.toString() || '' });
        }
        setLoading(false);
      });
    }
  }, [editId]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url = editId ? '/api/books/' + editId : '/api/books';
    const method = editId ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) router.push('/admin/books');
  };

  if (loading) return <div className="text-center py-16"><p className="text-4xl animate-pulse">📚</p><p className="text-gray-400 mt-2">লোড হচ্ছে...</p></div>;

  return (
    <div className="page-enter">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{editId ? '✏️ বই এডিট' : '➕ নতুন বই'}</h1>
      <form onSubmit={save} className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-6 lg:p-8 space-y-5 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">বইয়ের নাম *</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="w-full border-2 border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">লেখক</label>
            <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} className="w-full border-2 border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">পৃষ্ঠা সংখ্যা</label>
            <input value={form.pages} onChange={e => setForm(f => ({ ...f, pages: e.target.value }))} type="number" className="w-full border-2 border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">কভার ইমেজ</label>
          <ImageUploader current={form.coverImage} onUpload={(url) => setForm(f => ({ ...f, coverImage: url }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">বিবরণ</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="w-full border-2 border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'সেভ হচ্ছে...' : editId ? 'আপডেট করুন' : 'বই তৈরি করুন'}</button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border-2 border-emerald-100 rounded-xl text-sm hover-soft text-gray-600 bg-white">বাতিল</button>
        </div>
      </form>
    </div>
  );
}
