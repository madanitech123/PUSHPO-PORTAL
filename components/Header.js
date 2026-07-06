'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { IconSearch, IconMenu, IconX, IconChevronDown } from './icons';

const bnMonths = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];

export default function Header({ categories = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const now = new Date();
  const dateStr = `${bnMonths[now.getMonth()]} ${now.getFullYear()}`;

  const navItems = [
    { label: 'মূলপাতা', href: '/' },
    {
      label: 'সকল সংখ্যা',
      href: '/posts',
      dropdown: [
        { label: 'সব পোস্ট', href: '/posts' },
      ],
    },
    {
      label: 'বিভাগ',
      dropdown: categories.length > 0
        ? categories.map(cat => ({ label: cat.name, href: `/category/${cat.slug}` }))
        : [{ label: 'সব বিভাগ', href: '/posts' }],
    },
    { label: 'বই', href: '/books' },
    { label: 'যোগাযোগ', href: 'mailto:info@pushpo.com' },
  ];

  return (
    <header className="alkawsar-header">
      <div className="alkawsar-topbar">
        <div className="container-wide">
          <div className="flex items-center justify-between py-2.5">
            <Link href="/" className="flex flex-col no-underline">
              <span className="alkawsar-logo-small">মাসিক</span>
              <span className="alkawsar-logo-main">আল-কলম পুষ্প</span>
            </Link>
            <div className="hidden md:flex items-center gap-3 text-sm text-emerald-100">
              <span className="opacity-80">বর্ষ: ১, সংখ্যা: ০১</span>
              <span className="opacity-40">|</span>
              <span>{dateStr}</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="alkawsar-nav" ref={dropdownRef}>
        <div className="container-wide">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center gap-0">
              {navItems.map((item, i) => (
                <div key={i} className="alkawsar-nav-item-group" onMouseEnter={() => setOpenDropdown(i)} onMouseLeave={() => setOpenDropdown(null)}>
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                        className={`alkawsar-nav-link ${openDropdown === i ? 'active' : ''}`}
                      >
                        {item.label}
                        <IconChevronDown className={`w-3.5 h-3.5 ml-0.5 transition-transform ${openDropdown === i ? 'rotate-180' : ''}`} />
                      </button>
                      {openDropdown === i && (
                        <div className="alkawsar-dropdown animate-fade-up">
                          {item.dropdown.map((sub, j) => (
                            <Link key={j} href={sub.href} className="alkawsar-dropdown-link" onClick={() => setOpenDropdown(null)}>
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href={item.href} className="alkawsar-nav-link">{item.label}</Link>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(!searchOpen)} className="alkawsar-search-btn">
                <IconSearch className="w-4 h-4" />
              </button>
              <button className="md:hidden alkawsar-search-btn" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <IconX className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {searchOpen && (
            <form onSubmit={e => { e.preventDefault(); if (query) window.location.href = '/search?q=' + encodeURIComponent(query); }} className="pb-3 pt-1 flex gap-2 animate-fade-up">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="সার্চ করুন..." className="flex-1 border border-emerald-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
              <button type="submit" className="alkawsar-btn-primary">সার্চ</button>
            </form>
          )}
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100 py-2 px-4 animate-fade-up shadow-lg">
          {navItems.map((item, i) => (
            <div key={i}>
              {item.dropdown ? (
                <>
                  <span className="block px-3 py-2 text-sm font-bold text-emerald-800 border-b border-emerald-50">{item.label}</span>
                  {item.dropdown.map((sub, j) => (
                    <Link key={j} href={sub.href} className="block px-6 py-1.5 text-sm text-gray-600 hover:text-emerald-700" onClick={() => setMenuOpen(false)}>
                      {sub.label}
                    </Link>
                  ))}
                </>
              ) : (
                <Link href={item.href} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-700" onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
