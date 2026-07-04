'use client';
import { useState } from 'react';
import { IconImage, IconTrash } from './icons';

export default function ImageUploader({ onUpload, current }) {
  const [uploading, setUploading] = useState(false);

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) onUpload(data.url);
  };

  return (
    <div className="flex items-center gap-3">
      {current && (
        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-emerald-100 shrink-0">
          <img src={current} className="w-full h-full object-cover" />
        </div>
      )}
      <label className="cursor-pointer inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl px-4 py-2 text-sm text-emerald-700 transition hover-soft">
        {uploading ? (
          <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span> আপলোড হচ্ছে...</span>
        ) : (
          <><IconImage className="w-4 h-4" /> ছবি আপলোড</>
        )}
        <input type="file" accept="image/*" onChange={upload} className="hidden" />
      </label>
      {current && (
        <button type="button" onClick={() => onUpload('')} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition hover-soft">
          <IconTrash className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
