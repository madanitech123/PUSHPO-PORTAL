'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/admin/login') { setLoading(false); return; }
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.admin) { router.push('/admin/login'); return; }
      setAdmin(d.admin);
      setLoading(false);
    });
  }, [pathname]);

  if (pathname === '/admin/login') return <div className="min-h-screen bg-[#f0fdf4] islamic-pattern">{children}</div>;
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#f0fdf4]"><div className="text-center"><p className="text-4xl mb-4 animate-spin">🌸</p><p className="text-emerald-600 font-medium">লোড হচ্ছে...</p></div></div>;
  if (!admin) return null;

  return (
    <div className="flex min-h-screen bg-[#f0fdf4]">
      <AdminSidebar admin={admin} />
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
