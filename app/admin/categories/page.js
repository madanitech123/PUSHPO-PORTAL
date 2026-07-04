'use client';
import { useEffect, useState } from 'react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  const load = () => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    setName('');
    load();
  };

  const del = async (id) => {
    if (!confirm('ডিলিট করবেন?')) return;
    await fetch('/api/categories?id=' + id, { method: 'DELETE' });
    load();
  };

  return (
    <div className="page-enter">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🏷️ ক্যাটাগরি</h1>
      <form onSubmit={add} className="flex gap-2 mb-8">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="নতুন ক্যাটাগরির নাম" className="flex-1 border-2 border-emerald-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
        <button type="submit" className="btn-primary text-xs">যোগ করুন</button>
      </form>
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50">
            <tr>
              <th className="text-left p-4 text-gray-600 font-medium">নাম</th>
              <th className="text-left p-4 text-gray-600 font-medium">স্লাগ</th>
              <th className="text-left p-4 text-gray-600 font-medium">পোস্ট সংখ্যা</th>
              <th className="text-left p-4 text-gray-600 font-medium">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-t border-emerald-50 hover-soft">
                <td className="p-4 font-medium text-gray-800">{c.name}</td>
                <td className="p-4 text-gray-500 text-xs">{c.slug}</td>
                <td className="p-4 text-gray-500">{c._count?.posts || 0}</td>
                <td className="p-4">
                  <button onClick={() => del(c.id)} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-medium hover-soft">ডিলিট</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
