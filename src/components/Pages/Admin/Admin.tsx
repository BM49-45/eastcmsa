// src/components/Pages/Admin/Admin.tsx
'use client';

import React, { useEffect, useState, useCallback } from "react";
import UploadForm from "../../Forms/UploadForm";
import { fetchContent, deleteContentClient } from "@/services/contentService.client";
import { Content } from "@/types/content";
import { getAllAudioFiles } from "@/lib/r2";
import "./Admin.css";

interface Stats {
  totalContent: number;
  totalViews: number;
  totalDownloads: number;
  totalUsers: number;
  totalSpeakers: number;
  totalCategories: number;
  recentActivity: number;
}

export default function AdminClient() {
  const [contents, setContents] = useState<Content[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalContent: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalUsers: 0,
    totalSpeakers: 0,
    totalCategories: 4, // Fixed categories
    recentActivity: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch from multiple sources
      const [contentData, audioFiles, usersData, activityData] = await Promise.all([
        fetchContent().catch(() => []),
        getAllAudioFiles().catch(() => []),
        fetch('/api/admin/users/stats').then(res => res.json()).catch(() => ({ total: 0 })),
        fetch(`/api/analytics/activity?range=${timeRange}`).then(res => res.json()).catch(() => ({ count: 0 }))
      ]);

      // Calculate stats
      const totalContent = contentData.length + audioFiles.length;
      const totalViews = contentData.reduce((sum: number, c: Content) => sum + (c.views || 0), 0) +
                        audioFiles.reduce((sum: number, f: any) => sum + (f.views || 0), 0);
      const totalDownloads = contentData.reduce((sum: number, c: Content) => sum + (c.downloads || 0), 0) +
                            audioFiles.reduce((sum: number, f: any) => sum + (f.downloads || 0), 0);
      
      // Unique speakers
      const allSpeakers = new Set([
        ...contentData.map(c => (c as any).speaker).filter(Boolean),
        ...audioFiles.map(f => f.speaker).filter(Boolean)
      ]);

      setStats({
        totalContent,
        totalViews,
        totalDownloads,
        totalUsers: usersData.total || 0,
        totalSpeakers: allSpeakers.size,
        totalCategories: 4,
        recentActivity: activityData.count || 0,
      });

      setContents(contentData);
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadStats();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadStats]);

  const handleDelete = async (id: string) => {
    if (!confirm("Una uhakika unataka kufuta maudhui haya?")) return;
    try {
      const result = await deleteContentClient(id);
      
      if (result.success) {
        setContents(contents.filter((c) => c._id !== id));
        // Refresh stats after delete
        loadStats();
        alert("Maudhui yamefutwa kikamilifu!");
      } else {
        alert(result.error || "Hitilafu katika kufuta maudhui.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Hitilafu katika kufuta maudhui.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );

  return (
    <div className="admin-page p-6">
      <div className="admin-header flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🔧 Ukaguzi wa Mfumo</h1>
        
        {/* Time range selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Muda:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            title="Muda"
          >
            <option value="day">Leo</option>
            <option value="week">Wiki Hii</option>
            <option value="month">Mwezi Huu</option>
            <option value="year">Mwaka Huu</option>
            <option value="all">Wote</option>
          </select>
          <button
            type="button"
            onClick={loadStats}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            title="Refresh"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="stat-card bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500">📚 Maudhui Yote</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalContent}</p>
          <p className="text-xs text-gray-400">Jumla ya maudhui</p>
        </div>

        <div className="stat-card bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500">👁️ Matazamio</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
          <p className="text-xs text-green-600">+{stats.recentActivity} leo</p>
        </div>

        <div className="stat-card bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500">📥 Upakuaji</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Jumla ya upakuaji</p>
        </div>

        <div className="stat-card bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500">👥 Watumiaji</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          <p className="text-xs text-gray-400">Watumiaji waliosajiliwa</p>
        </div>

        <div className="stat-card bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500">🎙️ Wazungumzaji</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalSpeakers}</p>
          <p className="text-xs text-gray-400">Wazungumzaji tofauti</p>
        </div>

        <div className="stat-card bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm text-gray-500">📂 Kategoria</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
          <p className="text-xs text-gray-400">Tawhiid, Sirah, Fiqh, Mihadhara</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">📊 Shughuli za Kila Mwezi</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart inaonyesha data halisi kutoka kwenye shughuli za tovuti</p>
            {/* Actual chart would go here with real data */}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">🔥 Maudhui Maarufu</h2>
          <div className="space-y-3">
            {contents.slice(0, 5).map((content, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{content.title}</p>
                  <p className="text-sm text-gray-500">{(content as any).speaker}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">👁️ {content.views || 0}</p>
                  <p className="text-sm">📥 {content.downloads || 0}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-sections grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content List */}
        <div className="section lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">📋 Orodha ya Maudhui</h2>
          <div className="content-list space-y-3 max-h-96 overflow-y-auto">
            {contents.map((content) => (
              <div key={content._id} className="content-item p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="content-info">
                    <h4 className="font-medium">{content.title}</h4>
                    <p className="text-sm text-gray-600">{(content as any).speaker}</p>
                    <p className="text-xs text-gray-500">{content.category}</p>
                    <div className="content-stats flex gap-3 mt-2 text-xs">
                      <span>👁️ {content.views || 0}</span>
                      <span>👍 {content.likes || 0}</span>
                      <span>📥 {content.downloads || 0}</span>
                    </div>
                  </div>
                  <div className="content-actions flex gap-2">
                    <button type="button" className="edit-btn p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      ✏️
                    </button>
                    <button
                      type="button"
                      className="delete-btn p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      onClick={() => handleDelete(content._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Form */}
        <div className="section bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">📤 Pakia Maudhui Mapya</h2>
          <UploadForm onUploadSuccess={loadStats} />
        </div>
      </div>
    </div>
  );
}