'use client';
import { useState, useEffect } from 'react';
import { IconHeart, IconComment as IconCommentBubble, IconSend, IconUser } from './icons';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ author: '', email: '', content: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/comments?postId=' + postId + '&approved=true').then(r => r.json()).then(d => setComments(d.comments || []));
  }, [postId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.author || !form.content) return;
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, postId }),
    });
    setSubmitted(true);
    setForm({ author: '', email: '', content: '' });
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <IconCommentBubble className="w-5 h-5 text-gray-700" />
        <h3 className="text-base font-bold text-gray-800">মন্তব্য <span className="font-normal text-gray-400">({comments.length})</span></h3>
      </div>

      <div className="space-y-4 mb-6">
        {comments.map(c => (
          <div key={c.id} className="flex gap-3 glass-card p-4">
            <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm mt-0.5">
              {c.author[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold text-sm text-gray-800">{c.author}</span>
                <span className="text-gray-400 text-xs">{new Date(c.createdAt).toLocaleDateString('bn-BD')}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{c.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <IconCommentBubble className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">প্রথম মন্তব্য করুন</p>
          </div>
        )}
      </div>

      {submitted ? (
        <div className="glass p-5 rounded-2xl text-sm text-center border border-emerald-100">
          <IconCheck className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
          <p className="font-medium text-gray-700">আপনার মন্তব্য পাঠানো হয়েছে</p>
          <p className="text-gray-400 text-xs mt-1">অ্যাডমিন অনুমোদন করলে প্রকাশিত হবে</p>
        </div>
      ) : (
        <form onSubmit={submit} className="glass rounded-2xl p-5 space-y-3">
          <h4 className="font-medium text-gray-700 text-sm flex items-center gap-2">
            <IconCommentBubble className="w-4 h-4" /> মন্তব্য করুন
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              id="comment-input"
              value={form.author}
              onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
              placeholder="আপনার নাম"
              className="border border-emerald-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition bg-white/60"
            />
            <input
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="ইমেইল (ঐচ্ছিক)"
              type="email"
              className="border border-emerald-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition bg-white/60"
            />
          </div>
          <textarea
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            placeholder="আপনার মন্তব্য লিখুন..."
            rows={2}
            className="border border-emerald-100 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition bg-white/60 resize-none"
          />
          <button type="submit" className="btn-primary text-xs py-2.5">
            <IconSend className="w-4 h-4" /> পাঠান
          </button>
        </form>
      )}
    </div>
  );
}

function IconCheck({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="16 8 10 16 7 13"/>
    </svg>
  );
}
