import './globals.css';

export const metadata = {
  title: 'পুষ্প — ইসলামিক প্রকাশনা ও সংবাদ',
  description: 'পুষ্প — জ্ঞানের আলোয় আলোকিত পাঠক। ইসলামিক বই, সাহিত্য, সংবাদ ও জ্ঞানভিত্তিক প্রকাশনার নির্ভরযোগ্য প্ল্যাটফর্ম।',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌸</text></svg>" />
      </head>
      <body className="bg-[#f0fdf4]">{children}</body>
    </html>
  );
}
