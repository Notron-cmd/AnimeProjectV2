'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchWithCsrf } from '@/lib/csrf-client';

export type NotificationItem = {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  anime: {
    id: string;
    anilistId: number;
    title: string;
    imageUrl: string;
  } | null;
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    function connect() {
      const es = new EventSource('/api/notifications/subscribe');

      es.addEventListener('notification', (event) => {
        try {
          const { notification, unreadCount: unread } = JSON.parse(event.data);
          setNotifications((prev) => {
            const exists = prev.some((n) => n.id === notification.id);
            if (exists) return prev;
            return [notification, ...prev];
          });
          setUnreadCount(unread);
        } catch {
          /* ignore */
        }
      });

      es.onerror = () => {
        es.close();
        reconnectTimer.current = setTimeout(connect, 3000);
      };

      esRef.current = es;
    }

    connect();

    return () => {
      if (esRef.current) esRef.current.close();
      clearTimeout(reconnectTimer.current);
    };
  }, [fetchNotifications]);

  const markAllRead = useCallback(async () => {
    await fetchWithCsrf('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const markRead = useCallback(async (id: string) => {
    await fetchWithCsrf('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id] }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const checkForUpdates = useCallback(async () => {
    try {
      await fetchWithCsrf('/api/notifications/check', { method: 'POST' });
    } catch {
      /* ignore */
    }
  }, []);

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    checkForUpdates,
    markAllRead,
    markRead,
  };
}
