// src/components/Forms/UploadForm.tsx
'use client';

import React, { useState } from 'react';
import { createContent } from '@/services/contentService';
import './UploadForm.css';

interface UploadFormProps {
  onUploadSuccess?: () => void;
}

interface FormData {
  title: string;
  category: string;
  description: string;
  file: File | null;
}

export default function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    description: '',
    file: null
  });
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      const contentData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        fileName: formData.file?.name,
        fileSize: formData.file?.size,
        fileType: formData.file?.type,
      };

      await createContent(contentData);
      
      setFormData({
        title: '',
        category: '',
        description: '',
        file: null
      });
      
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      
      alert('Maudhui yamepakiwa kikamilifu!');
    } catch (err) {
      setError('Hitilafu katika kupakia maudhui. Tafadhali jaribu tena.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Kichwa *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Weka kichwa cha maudhui"
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Aina ya Maudhui *</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Chagua aina</option>
          <option value="sirah">Sirah</option>
          <option value="nyimbo">Nyimbo</option>
          <option value="mawaidha">Mawaidha</option>
          <option value="nyenzo">Nyenzo za Kujifunza</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Maelezo</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Weka maelezo mafupi ya maudhui"
        />
      </div>

      <div className="form-group">
        <label htmlFor="file">Faili *</label>
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleFileChange}
          required
          accept=".pdf,.mp3,.mp4,.jpg,.png"
        />
        <small>Aina zinazokubalika: PDF, MP3, MP4, JPG, PNG</small>
      </div>

      <button 
        type="submit" 
        className="submit-btn"
        disabled={uploading}
      >
        {uploading ? 'Inapakia...' : 'Pakia Maudhui'}
      </button>
    </form>
  );
}