'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconDashboard, IconFile, IconPlus, IconComment as IconCommentBubble, IconBook, IconBookOpen, IconTag, IconSettings, IconUsers, IconExternal, IconFlower } from './icons';

const links = [
  { href: '/admin', label: 'ড্যাশবোর্ড', icon: IconDashboard },
  { href: '/admin/posts', label: 'পোস্টসমূহ', icon: IconFile },
  { href: '/admin/posts/new', label: 'নতুন পোস্ট', icon: IconPlus },
  { href: '/admin/comments', label: 'মন্তব্য', icon: IconCommentBubble },
  { href: '/admin/books', label: 'বই', icon: IconBook },
  { href: '/admin/books/new', label: 'নতুন বই', icon: IconBookOpen },
  { href: '/admin/categories', label: 'ক্যাটাগরি', icon: IconTag },
  { href: '/admin/settings', label: 'সেটিংস', icon: IconSettings },
  { href: '/admin/admins', label: 'এডমিন', icon: IconUsers },
];

export default function AdminSidebar({ admin }) {
  const pathname = usePathname();

  return (
    <div className="w-60 bg-white/90 backdrop-blur-xl border-r border-emerald-50 min-h-screen shrink-0 hidden md:block">
      <div className="p-5 border-b border-emerald-50">
        <Link href="/admin" className="text-lg font-bold flex items-center gap-2.5">
          <div className="w-8 h-8 gradient-bg rounded-xl flex items-center justify-center text-white shadow-sm">
            <IconFlower className="w-4 h-4" />
          </div>
          <span className="gradient-text">মাসিক আল-কলম পুষ্প</span>
        </Link>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          <span className="text-xs text-gray-500">{admin?.name}</span>
          <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-medium ml-auto">{admin?.role === 'superadmin' ? 'সুপার' : 'এডমিন'}</span>
        </div>
      </div>
      <nav className="p-3 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
            pathname === href ? 'gradient-bg text-white shadow-sm' : 'text-gray-600 hover-soft hover:bg-emerald-50'
          }`}>
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </Link>
        ))}
        <div className="border-t border-emerald-50 pt-2 mt-2">
          <a href="/" target="_blank" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover-soft hover:bg-emerald-50 transition-all duration-300">
            <IconExternal className="w-4 h-4" />
            <span>সাইট দেখুন</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
