'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconFlower, IconUser, IconLogout } from '@/components/icons';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const login = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-3xl p-8 w-full max-w-sm border border-white/30 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200/50">
            <IconFlower className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">মাসিক আল-কলম পুষ্প</h1>
          <p className="text-sm text-gray-500 mt-1 font-light">অ্যাডমিন প্যানেল</p>
        </div>
        <form onSubmit={login} className="space-y-4">
          {error && <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm p-3 rounded-xl flex items-center gap-2"><IconAlert className="w-4 h-4" /> {error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">ইমেইল</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full border border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition bg-white/60" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">পাসওয়ার্ড</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="w-full border border-emerald-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition bg-white/60" />
          </div>
          <button type="submit" className="w-full gradient-bg text-white py-2.5 rounded-xl font-medium hover-pop">লগইন</button>
        </form>
        <div className="mt-6 text-xs text-gray-400 text-center bg-emerald-50/50 rounded-xl p-3 border border-emerald-50/50">
          Default: admin@portal.com / admin123
        </div>
      </div>
    </div>
  );
}

function IconAlert({ className }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }
