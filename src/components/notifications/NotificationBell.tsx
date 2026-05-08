"use client";

import { useState, useEffect } from 'react';
import { Bell, X, Calendar, MapPin, Clock, User, BookOpen, Headphones, FileText } from 'lucide-react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadCount, Notification } from '@/lib/storage';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = () => {
    const notifs = getNotifications();
    setNotifications(notifs);
    setUnreadCount(notifs.filter(n => !n.read).length);
  };

  // Load notifications on mount and listen for new ones
  useEffect(() => {
    loadNotifications();
    
    // Listen for new notifications
    const handleNewNotification = (event: CustomEvent) => {
      loadNotifications();
      // Auto-open bell when new notification arrives
      setIsOpen(true);
      setTimeout(() => setIsOpen(false), 5000);
    };
    
    window.addEventListener('new-notification', handleNewNotification as EventListener);
    
    // Check for new content every 30 seconds
    const interval = setInterval(() => {
      // This will trigger check for new content
      window.dispatchEvent(new CustomEvent('check-new-content'));
    }, 30000);
    
    return () => {
      window.removeEventListener('new-notification', handleNewNotification as EventListener);
      clearInterval(interval);
    };
  }, []);

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    loadNotifications();
  };

  const getIcon = (type: Notification['type'], category: Notification['category']) => {
    if (type === 'event') return '📢';
    if (category === 'book') return '📖';
    if (category === 'tawhiid') return '📚';
    if (category === 'fiqh') return '⚖️';
    if (category === 'sirah') return '🌟';
    return '📢';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Arifa</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Soma zote
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Hakuna arifa mpya</p>
                <p className="text-xs mt-1">Utapokea arifa hapa zitakapotokea</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                    !notif.read ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-l-emerald-500' : ''
                  }`}
                  onClick={() => {
                    if (!notif.read) handleMarkAsRead(notif.id);
                    if (notif.link) window.location.href = notif.link;
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getIcon(notif.type, notif.category)}</span>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                          {notif.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notif.createdAt).toLocaleDateString('sw-TZ')}
                      </p>
                    </div>
                    
                    {!notif.read && (
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}