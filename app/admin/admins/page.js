'use client';
import { useEffect, useState } from 'react';

export default function AdminAdmins() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [error, setError] = useState('');

  const load = () => {
    fetch('/api/admins').then(r => r.json()).then(d => setAdmins(d.admins || [])).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admins', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    setForm({ name: '', email: '', password: '', role: 'admin' });
    load();
  };

  return (
    <div className="page-enter">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">👤 এডমিন ব্যবস্থাপনা</h1>

      <form onSubmit={add} className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-6 mb-8 space-y-4 max-w-lg">
        <h3 className="font-bold text-gray-700 flex items-center gap-2">➕ নতুন এডমিন যোগ করুন</h3>
        {error && <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-xl border border-rose-100">{error}</div>}
        <div className="grid grid-cols-2 gap-4">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="নাম" required className="border-2 border-emerald-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="ইমেইল" type="email" required className="border-2 border-emerald-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="পাসওয়ার্ড" type="password" required className="border-2 border-emerald-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition" />
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="border-2 border-emerald-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition">
            <option value="admin">এডমিন</option>
            <option value="superadmin">সুপার এডমিন</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">যোগ করুন</button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50">
            <tr>
              <th className="text-left p-4 text-gray-600 font-medium">নাম</th>
              <th className="text-left p-4 text-gray-600 font-medium">ইমেইল</th>
              <th className="text-left p-4 text-gray-600 font-medium">রোল</th>
              <th className="text-left p-4 text-gray-600 font-medium">জয়েন</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id} className="border-t border-emerald-50 hover-soft">
                <td className="p-4 font-medium text-gray-800">{a.name}</td>
                <td className="p-4 text-gray-500">{a.email}</td>
                <td className="p-4">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${a.role === 'superadmin' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {a.role === 'superadmin' ? 'সুপার এডমিন' : 'এডমিন'}
                  </span>
                </td>
                <td className="p-4 text-xs text-gray-500">{new Date(a.createdAt).toLocaleDateString('bn-BD')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
