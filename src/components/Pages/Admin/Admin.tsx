"use client";

import React, { useEffect, useState, useCallback } from "react";
import UploadForm from "../../Forms/UploadForm";
import "./Admin.css";

interface Content {
  _id: string;
  title: string;
  category?: string;
  views: number;
  likes: number;
  downloads: number;
}

export default function AdminClient() {
  const [contents, setContents] = useState<Content[]>([]);
  const [stats, setStats] = useState({
    totalContent: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  // 🔹 Load contents using fetch API
  const loadContents = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const formatted: Content[] = data.map((item: any) => ({
          _id: item._id ?? "",
          title: item.title ?? "Untitled",
          category: item.category,
          views: item.views ?? 0,
          likes: item.likes ?? 0,
          downloads: item.downloads ?? 0,
        }));
        setContents(formatted);

        setStats({
          totalContent: formatted.length,
          totalViews: formatted.reduce((sum, c) => sum + c.views, 0),
          totalDownloads: formatted.reduce((sum, c) => sum + c.downloads, 0),
          totalUsers: parseInt(localStorage.getItem("totalUsers") || "0", 10),
        });
      }
    } catch (err) {
      console.error("Error loading contents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContents();
  }, [loadContents]);

  const handleDelete = async (id: string) => {
    if (!confirm("Una uhakika unataka kufuta maudhui haya?")) return;
    try {
      const res = await fetch(`/api/content/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setContents(contents.filter((c) => c._id !== id));
        alert("Maudhui yamefutwa kikamilifu!");
      } else {
        alert("Hitilafu katika kufuta maudhui.");
      }
    } catch {
      alert("Hitilafu katika kufuta maudhui.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="admin-page">
      <div className="admin-header flex justify-between items-center">
        <h1>🔧 Ukaguzi wa Mfumo</h1>
      </div>

      <div className="admin-stats">
        {[
          { label: "Maudhui Yote", value: stats.totalContent, icon: "📚" },
          { label: "Matazamo", value: stats.totalViews, icon: "👁️" },
          { label: "Upakuaji", value: stats.totalDownloads, icon: "📥" },
          { label: "Watumiaji", value: stats.totalUsers, icon: "👥" },
        ].map((stat, idx) => (
          <div key={idx} className="stat-card">
            <h3>
              {stat.icon} {stat.label}
            </h3>
            <p className="stat-number">{stat.value}</p>
            <p>Jumla ya {stat.label.toLowerCase()}</p>
          </div>
        ))}
      </div>

      <div className="admin-sections">
        <div className="section">
          <h2>📋 Orodha ya Maudhui</h2>
          <div className="content-list">
            {contents.map((content) => (
              <div key={content._id} className="content-item">
                <div className="content-info">
                  <h4>{content.title}</h4>
                  <p className="category">{content.category}</p>
                  <div className="content-stats">
                    <span>👁️ {content.views}</span>
                    <span>👍 {content.likes}</span>
                    <span>📥 {content.downloads}</span>
                  </div>
                </div>
                <div className="content-actions">
                  <button className="edit-btn">✏️ Badilisha</button>
                  <button className="delete-btn" onClick={() => handleDelete(content._id)}>
                    🗑️ Futa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>📤 Pakia Maudhui Mapya</h2>
          <UploadForm onUploadSuccess={loadContents} />
        </div>
      </div>
    </div>
  );
}