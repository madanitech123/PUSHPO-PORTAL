'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconDashboard, IconFile, IconPlus, IconComment as IconCommentBubble, IconBook, IconSettings, IconFlower } from '@/components/icons';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/posts?status=draft&limit=1').then(r => r.json()),
      fetch('/api/posts?status=all&limit=1').then(r => r.json()),
      fetch('/api/comments?approved=false').then(r => r.json()),
      fetch('/api/comments?approved=true').then(r => r.json()),
    ]).then(([d, a, pc, ac]) => setStats({ totalPosts: a.total || 0, draftPosts: d.total || 0, pendingComments: pc.total || 0, totalComments: ac.total || 0 }));
  }, []);

  const cards = [
    { label: 'মোট পোস্ট', value: stats?.totalPosts, icon: IconFile, color: 'from-emerald-500 to-emerald-600' },
    { label: 'ড্রাফট', value: stats?.draftPosts, icon: IconFile, color: 'from-amber-500 to-amber-600' },
    { label: 'অননুমোদিত', value: stats?.pendingComments, icon: IconCommentBubble, color: 'from-rose-500 to-rose-600' },
    { label: 'মোট মন্তব্য', value: stats?.totalComments, icon: IconCommentBubble, color: 'from-blue-500 to-blue-600' },
  ];

  return (
    <div className="page-enter">
      <div className="flex items-center gap-3 mb-1">
        <IconDashboard className="w-6 h-6 text-emerald-600" />
        <h1 className="text-xl font-bold text-gray-800">ড্যাশবোর্ড</h1>
      </div>
      <p className="text-gray-500 text-sm mb-8">মাসিক আল কলম পুষ্প অ্যাডমিন প্যানেল</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((card, i) => (
          <div key={i} className="glass-card p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stats != null ? card.value : <span className="animate-pulse">--</span>}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-bold text-gray-800 section-title flex items-center gap-2 mb-5">
        <IconSettings className="w-4 h-4 text-emerald-600" /> দ্রুত লিংক
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/admin/posts/new', icon: IconPlus, title: 'নতুন পোস্ট', desc: 'লেখা বা ছবি পোস্ট করুন' },
          { href: '/admin/comments', icon: IconCommentBubble, title: 'মন্তব্য', desc: 'অনুমোদন/ডিলিট' },
          { href: '/admin/books', icon: IconBook, title: 'বই ক্যাটালগ', desc: 'যোগ/পরিচালনা' },
          { href: '/admin/settings', icon: IconSettings, title: 'সেটিংস', desc: 'পাসওয়ার্ড পরিবর্তন' },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="glass-card p-4 flex items-center gap-4">
            <item.icon className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
