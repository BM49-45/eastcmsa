"use client";

import React, { useState } from 'react';

export default function UploadForm({ onUploadSuccess }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Maudhui yamepakiwa kikamilifu!');
        setTitle('');
        setCategory('');
        setFile(null);
        onUploadSuccess();
      } else {
        alert('Hitilafu katika kupakia maudhui.');
      }
    } catch (error) {
      alert('Hitilafu katika kupakia maudhui.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="form-group">
        <label>Kichwa</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Aina</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label>Faili</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
      </div>
      
      <button type="submit" disabled={uploading}>
        {uploading ? 'Inapakia...' : 'Pakia'}
      </button>
    </form>
  );
}