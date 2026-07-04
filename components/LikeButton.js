'use client';
import { useState, useEffect } from 'react';
import { IconHeart, IconComment, IconShare } from './icons';

export default function LikeButton({ postId, showComment }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/api/likes?postId=' + postId).then(r => r.json()).then(d => { setCount(d.count); setLiked(d.userLiked); });
  }, [postId]);

  const toggle = async () => {
    const res = await fetch('/api/likes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId }) });
    const d = await res.json();
    setLiked(d.liked);
    setCount(c => d.liked ? c + 1 : c - 1);
  };

  return (
    <div className="ig-action-bar">
      <button onClick={toggle} className="ig-icon-btn flex items-center gap-1.5">
        <IconHeart filled={liked} className={`w-6 h-6 transition-colors ${liked ? 'text-rose-500' : 'text-gray-700'}`} />
        <span className="text-sm font-medium text-gray-700">{count}</span>
      </button>
      {showComment && (
        <button onClick={() => document.getElementById('comment-input')?.focus()} className="ig-icon-btn flex items-center gap-1.5">
          <IconComment className="w-6 h-6 text-gray-700" />
        </button>
      )}
      <button className="ig-icon-btn ml-auto">
        <IconBookmark className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
}

function IconBookmark({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  );
}

export { IconBookmark };
