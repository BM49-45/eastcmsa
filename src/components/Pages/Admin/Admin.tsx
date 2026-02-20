"use client";

import React, { useEffect, useState, useCallback } from "react";
import { default as io, Socket } from "socket.io-client"; // ⚡️ Socket.IO client - fixed import
import { contentService } from "../../../services/contentService";
import UploadForm from "../../Forms/UploadForm";
import "./Admin.css";

// 🔹 Content interface
interface Content {
  _id: string;
  title: string;
  category?: string;
  views: number;
  likes: number;
  downloads: number;
}

// 🔹 Notification interface
interface AppNotification {
  id: string;
  type: "activity" | "content";
  title: string;
  time: Date;
}

export default function Admin() {
  const [contents, setContents] = useState<Content[]>([]);
  const [stats, setStats] = useState({
    totalContent: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [socket, setSocket] = useState<typeof Socket | null>(null); // Fixed: using typeof Socket

  // 🔹 Load content & stats
  const loadContents = useCallback(async () => {
    try {
      const data = await contentService.getAllContent();
      
      // Check if data is array and has the expected structure
      if (Array.isArray(data)) {
        // Map the data to ensure it matches Content interface
        const formattedContents: Content[] = data.map((item: any) => ({
          _id: item._id || '',
          title: item.title || 'Untitled',
          category: item.category,
          views: item.views || 0,
          likes: item.likes || 0,
          downloads: item.downloads || 0
        }));
        
        setContents(formattedContents);

        const totalViews = formattedContents.reduce((sum, c) => sum + c.views, 0);
        const totalDownloads = formattedContents.reduce((sum, c) => sum + c.downloads, 0);

        setStats({
          totalContent: formattedContents.length,
          totalViews,
          totalDownloads,
          totalUsers: parseInt(localStorage.getItem("totalUsers") || "0", 10),
        });
      } else {
        console.error("Invalid data format received:", data);
      }
    } catch (err) {
      console.error("Error loading contents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Setup Socket.IO
  useEffect(() => {
    loadContents();

    const s = io(); // connect to default endpoint
    setSocket(s as typeof Socket);

    s.on("activities", (data: any[]) => {
      setNotifications(
        data.map((a) => ({
          id: a._id || Math.random().toString(),
          type: "activity",
          title: a.userName
            ? `${a.userName} ${a.action}${
                a.contentTitle ? `: ${a.contentTitle}` : ""
              }`
            : "Unknown",
          time: new Date(a.time || Date.now()),
        }))
      );
    });

    return () => {
      s.disconnect();
    };
  }, [loadContents]);

  const markAllAsRead = () => {
    setNotifications([]);
    socket?.emit("markAllRead");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Una uhakika unataka kufuta maudhui haya?")) return;
    try {
      await contentService.deleteContent(id);
      setContents(contents.filter((c) => c._id !== id));
      alert("Maudhui yamefutwa kikamilifu!");
    } catch (err) {
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
        <div className="relative">
          <button
            type="button"
            onClick={markAllAsRead}
            className="relative p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Notifikesheni"
            title="Notifikesheni"
          >
            🔔
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>
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
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(content._id)}
                  >
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