// src/components/Forms/UploadForm.tsx
'use client';

import React, { useState } from 'react';
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
  const [progress, setProgress] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('Faili ni kubwa sana. Tafadhali chagua faili chini ya 50MB.');
        e.target.value = '';
        return;
      }
      
      // Validate file type
      const allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png',
        'application/pdf',
        'audio/mpeg', 'audio/mp3',
        'video/mp4'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError('Aina ya faili haikubaliki. Tafadhali chagua PDF, MP3, MP4, JPG, au PNG.');
        e.target.value = '';
        return;
      }
      
      setError('');
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file) {
      setError('Tafadhali chagua faili');
      return;
    }

    if (!formData.title.trim()) {
      setError('Tafadhali weka kichwa cha maudhui');
      return;
    }

    if (!formData.category) {
      setError('Tafadhali chagua aina ya maudhui');
      return;
    }
    
    setUploading(true);
    setError('');
    setProgress(0);

    try {
      // Create FormData for upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.file);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('category', formData.category);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Upload file and data
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Hitilafu katika kupakia faili');
      }
      
      setProgress(100);
      
      // Reset form after successful upload
      setTimeout(() => {
        setFormData({
          title: '',
          category: '',
          description: '',
          file: null
        });
        
        // Reset file input
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        setProgress(0);
        
        if (onUploadSuccess) {
          onUploadSuccess();
        }
        
        alert('✓ Maudhui yamepakiwa kikamilifu!');
      }, 500);
      
    } catch (err: any) {
      setError(err.message || 'Hitilafu katika kupakia maudhui. Tafadhali jaribu tena.');
      console.error('Upload error:', err);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  // Function to get progress bar class based on progress value
  const getProgressBarClass = () => {
    if (progress <= 10) return 'progress-fill progress-10';
    if (progress <= 20) return 'progress-fill progress-20';
    if (progress <= 30) return 'progress-fill progress-30';
    if (progress <= 40) return 'progress-fill progress-40';
    if (progress <= 50) return 'progress-fill progress-50';
    if (progress <= 60) return 'progress-fill progress-60';
    if (progress <= 70) return 'progress-fill progress-70';
    if (progress <= 80) return 'progress-fill progress-80';
    if (progress <= 90) return 'progress-fill progress-90';
    return 'progress-fill progress-100';
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <h2>📤 Pakia Maudhui Mapya</h2>
      
      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}
      
      {progress > 0 && progress < 100 && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className={getProgressBarClass()}></div>
          </div>
          <p className="progress-text">{progress}% imekamilika</p>
        </div>
      )}
      
      {progress === 100 && (
        <div className="success-message">
          <span>✅</span>
          <p>Imepakiwa kikamilifu!</p>
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="title">
          Kichwa <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Weka kichwa cha maudhui"
          disabled={uploading}
          className={formData.title ? 'filled' : ''}
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">
          Aina ya Maudhui <span className="required">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          disabled={uploading}
          className={formData.category ? 'filled' : ''}
        >
          <option value="">Chagua aina</option>
          <option value="sirah">📖 Sirah</option>
          <option value="nyimbo">🎵 Nyimbo</option>
          <option value="mawaidha">💭 Mawaidha</option>
          <option value="nyenzo">📚 Nyenzo za Kujifunza</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Maelezo (si lazima)</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Weka maelezo mafupi ya maudhui"
          disabled={uploading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="file">
          Faili <span className="required">*</span>
        </label>
        <div className="file-input-wrapper">
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            required
            accept=".pdf,.mp3,.mp4,.jpg,.jpeg,.png,image/*,audio/*,video/*"
            disabled={uploading}
          />
          <div className="file-info">
            {formData.file ? (
              <span className="file-selected">
                ✓ {formData.file.name} ({(formData.file.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            ) : (
              <span className="file-placeholder">Bofya kuchagua faili...</span>
            )}
          </div>
        </div>
        <small className="hint">
          📌 Aina zinazokubalika: PDF, MP3, MP4, JPG, PNG (Max: 50MB)
        </small>
      </div>

      <button 
        type="submit" 
        className={`submit-btn ${uploading ? 'uploading' : ''}`}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <span className="spinner"></span>
            Inapakia... {progress}%
          </>
        ) : (
          <>
            <span>📤</span>
            Pakia Maudhui
          </>
        )}
      </button>
    </form>
  );
}