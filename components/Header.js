'use client';
import Link from 'next/link';
import { useState } from 'react';
import { IconSearch, IconMenu, IconX, IconFlower, IconBook } from './icons';

export default function Header({ categories = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-islamic-pattern text-white text-center py-2 px-4 text-xs md:text-sm font-light tracking-wide">
        পুষ্প — জ্ঞানের আলোয় আলোকিত পাঠক
        <span className="hidden md:inline ml-2 opacity-70">| {new Date().toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>

      <div className="sticky-nav">
        <div className="container-wide">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                <IconFlower className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold gradient-text">পুষ্প</span>
                <span className="hidden sm:inline text-lg font-bold gradient-text ml-1">প্রকাশন</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-0.5 text-sm font-medium text-gray-600">
              {categories.slice(0, 6).map(cat => (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="nav-link px-3 py-2 rounded-lg hover-soft">
                  {cat.name}
                </Link>
              ))}
              <Link href="/books" className="nav-link px-3 py-2 rounded-lg hover-soft flex items-center gap-1">বই</Link>
            </nav>

            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(!searchOpen)} className="hover-glow p-2 rounded-lg hover:bg-emerald-50 text-gray-500 transition">
                <IconSearch className="w-5 h-5" />
              </button>
              <button className="md:hidden hover-glow p-2 rounded-lg hover:bg-emerald-50 text-gray-500 transition" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {searchOpen && (
            <form onSubmit={e => { e.preventDefault(); if (query) window.location.href = '/search?q=' + encodeURIComponent(query); }} className="pb-4 flex gap-2 animate-fade-up">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="সার্চ করুন..." className="flex-1 border border-emerald-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition bg-white/70" />
              <button type="submit" className="btn-primary py-2.5"><IconSearch className="w-4 h-4" /> সার্চ</button>
            </form>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden glass border-t border-emerald-50 py-3 px-4 space-y-1 animate-fade-up shadow-lg">
          {categories.map(cat => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="block px-3 py-2 rounded-lg hover-soft text-sm text-gray-600" onClick={() => setMenuOpen(false)}>
              {cat.name}
            </Link>
          ))}
          <Link href="/books" className="flex items-center gap-2 px-3 py-2 rounded-lg hover-soft text-sm text-gray-600" onClick={() => setMenuOpen(false)}><IconBook className="w-4 h-4" /> বই</Link>
          <Link href="/posts" className="block px-3 py-2 rounded-lg hover-soft text-sm text-gray-600" onClick={() => setMenuOpen(false)}>সব পোস্ট</Link>
        </div>
      )}
    </header>
  );
}
