import { IconFlower, IconBook as Book, IconHome as Home, IconSearch as Search, IconGlobe as Globe, IconQuote as Quote } from './icons';

export default function Footer() {
  return (
    <footer className="gradient-bg text-white mt-16 relative overflow-hidden">
      <div className="container-wide py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
                <IconFlower className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">পুষ্প প্রকাশন</span>
            </div>
            <p className="text-emerald-100/80 text-sm leading-relaxed max-w-md">
              জ্ঞানের আলোয় আলোকিত পাঠক। ইসলামিক জ্ঞান, সাহিত্য ও সংস্কৃতি বিকাশে আমাদের
              নিবেদিত প্রচেষ্টা। আমরা প্রকাশ করি মানসম্মত ইসলামিক বই, প্রবন্ধ ও জ্ঞানভিত্তিক
              কন্টেন্ট।
            </p>
            <div className="flex gap-2.5 mt-5">
              {[Globe, Book, Quote].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center hover-pop text-sm">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white text-base font-bold mb-4 relative inline-block">
              লিংক
              <span className="absolute -bottom-1 left-0 w-6 h-0.5 bg-white/30 rounded"></span>
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[{ label: 'বইয়ের ক্যাটালগ', href: '/books', icon: Book }, { label: 'সব পোস্ট', href: '/posts', icon: Home }, { label: 'সার্চ', href: '/search', icon: Search }].map(({ label, href, icon: Icon }, i) => (
                <li key={i}>
                  <a href={href} className="text-emerald-100/70 hover:text-white transition flex items-center gap-2 hover-soft">
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white text-base font-bold mb-4 relative inline-block">
              যোগাযোগ
              <span className="absolute -bottom-1 left-0 w-6 h-0.5 bg-white/30 rounded"></span>
            </h3>
            <ul className="space-y-2.5 text-sm text-emerald-100/70">
              <li className="flex items-center gap-2"><span className="opacity-50">@</span> info@pushpo.com</li>
              <li className="flex items-center gap-2"><span className="opacity-50">+</span> +880 1700-000000</li>
              <li className="flex items-center gap-2"><span className="opacity-50">📍</span> ঢাকা, বাংলাদেশ</li>
            </ul>
            <div className="mt-4 bg-white/8 rounded-xl p-3 text-center text-sm backdrop-blur-sm">
              <p className="text-emerald-100/80">রমজান মোবারক</p>
              <p className="text-xs text-emerald-100/50 mt-0.5">১৪৪৬ হিজরী</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/6 py-4 text-center text-xs text-emerald-100/50">
        &copy; {new Date().getFullYear()} পুষ্প প্রকাশন
      </div>
    </footer>
  );
}
