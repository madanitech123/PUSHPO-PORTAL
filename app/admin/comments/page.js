'use client';
import { useEffect, useState } from 'react';

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = () => {
    const url = filter === 'pending' ? '/api/comments?approved=false' : '/api/comments';
    fetch(url).then(r => r.json()).then(d => setComments(d.comments || []));
  };

  useEffect(() => { load(); }, [filter]);

  const approve = async (id) => {
    await fetch('/api/comments/' + id, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isApproved: true }) });
    load();
  };

  const del = async (id) => {
    if (!confirm('ডিলিট করবেন?')) return;
    await fetch('/api/comments/' + id, { method: 'DELETE' });
    load();
  };

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">💬 মন্তব্য ব্যবস্থাপনা</h1>
        <div className="flex gap-2">
          {['all', 'pending'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-xl text-sm transition-all ${filter === f ? 'gradient-bg text-white shadow-sm' : 'bg-white border-2 border-emerald-100 text-gray-600 hover-soft'}`}>
              {f === 'all' ? 'সব' : 'অননুমোদিত'}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50">
              <tr>
                <th className="text-left p-4 text-gray-600 font-medium">লেখক</th>
                <th className="text-left p-4 text-gray-600 font-medium hidden md:table-cell">পোস্ট</th>
                <th className="text-left p-4 text-gray-600 font-medium">মন্তব্য</th>
                <th className="text-left p-4 text-gray-600 font-medium hidden md:table-cell">তারিখ</th>
                <th className="text-left p-4 text-gray-600 font-medium">স্ট্যাটাস</th>
                <th className="text-left p-4 text-gray-600 font-medium">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {comments.map(c => (
                <tr key={c.id} className="border-t border-emerald-50 hover-soft">
                  <td className="p-4">
                    <p className="font-medium text-gray-800">{c.author}</p>
                    {c.email && <p className="text-xs text-gray-400">{c.email}</p>}
                  </td>
                  <td className="p-4 hidden md:table-cell text-xs text-gray-500 max-w-40 truncate">{c.post?.title || '-'}</td>
                  <td className="p-4 text-xs max-w-60 truncate text-gray-600">{c.content}</td>
                  <td className="p-4 hidden md:table-cell text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString('bn-BD')}</td>
                  <td className="p-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${c.isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {c.isApproved ? 'অনুমোদিত' : 'অপেক্ষমান'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!c.isApproved && <button onClick={() => approve(c.id)} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover-soft">অনুমোদন</button>}
                      <button onClick={() => del(c.id)} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-medium hover-soft">ডিলিট</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {comments.length === 0 && <p className="text-center text-gray-400 py-16">কোনো মন্তব্য নেই</p>}
      </div>
    </div>
  );
}
