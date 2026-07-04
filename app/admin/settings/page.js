'use client';
import { useState, useEffect } from 'react';
import { IconSettings, IconUser, IconLogout, IconCheck } from '@/components/icons';

export default function AdminSettings() {
  const [admin, setAdmin] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (d.admin) { setAdmin(d.admin); setForm(f => ({ ...f, name: d.admin.name, email: d.admin.email })); }
    });
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  const save = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setSaving(true);
    if (form.newPassword && form.newPassword !== form.confirmPassword) { setError('নতুন পাসওয়ার্ড মিলছে না'); setSaving(false); return; }
    const body = { name: form.name, email: form.email };
    if (form.currentPassword && form.newPassword) { body.currentPassword = form.currentPassword; body.newPassword = form.newPassword; }
    const res = await fetch('/api/auth/password', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error); return; }
    setMessage(data.message);
    setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
  };

  if (!admin) return <div className="text-center py-16"><div className="w-12 h-12 gradient-bg rounded-2xl animate-pulse mx-auto"></div></div>;

  return (
    <div className="page-enter max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <IconSettings className="w-6 h-6 text-emerald-600" />
        <h1 className="text-xl font-bold text-gray-800">সেটিংস</h1>
      </div>
      <p className="text-gray-500 text-sm mb-8">প্রোফাইল ও পাসওয়ার্ড পরিবর্তন</p>

      <form onSubmit={save} className="space-y-5">
        <div className="glass-card p-6 lg:p-8 space-y-5">
          <h2 className="text-sm font-bold text-gray-800 section-title flex items-center gap-2">
            <IconUser className="w-4 h-4 text-emerald-600" /> প্রোফাইল তথ্য
          </h2>
          {message && <div className="bg-emerald-50/80 border border-emerald-100 text-emerald-700 text-sm p-3 rounded-xl flex items-center gap-2"><IconCheck className="w-4 h-4" /> {message}</div>}
          {error && <div className="bg-rose-50/80 border border-rose-100 text-rose-600 text-sm p-3 rounded-xl flex items-center gap-2"><IconAlert className="w-4 h-4" /> {error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">নাম</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition bg-white/60" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">ইমেইল</label>
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" className="w-full border border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition bg-white/60" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 lg:p-8 space-y-4">
          <h2 className="text-sm font-bold text-gray-800 section-title">পাসওয়ার্ড পরিবর্তন</h2>
          <p className="text-xs text-gray-400">পাসওয়ার্ড না বদলালে ফাঁকা রাখুন</p>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">বর্তমান পাসওয়ার্ড</label>
            <input value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} type="password" className="w-full border border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition bg-white/60" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">নতুন পাসওয়ার্ড</label>
              <input value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} type="password" className="w-full border border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition bg-white/60" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">নতুন পাসওয়ার্ড (আবার)</label>
              <input value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} type="password" className="w-full border border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition bg-white/60" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
          </button>
          <button type="button" onClick={logout} className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm hover-soft">
            <IconLogout className="w-4 h-4" /> লগআউট
          </button>
        </div>
      </form>
    </div>
  );
}

function IconAlert({ className }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }
