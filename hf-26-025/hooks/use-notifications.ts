import { useState, useCallback, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/auth-context';

export type NotificationType = 'stock_alert' | 'low_stock' | 'stock_restored' | 'refill_reminder' | 'verify_log';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  group: 'Today' | 'Yesterday' | 'Earlier';
  read: boolean;
  drug?: string;
  drugCode?: string;
  actionLabel?: string;
  actionTarget?: 'find_stock' | 'view_prescription' | 'scan';
}

export function useNotifications() {
  const { wallet } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread' | 'stock' | 'refills'>('all');
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(() => {
    if (!wallet) return;
    const q = filter === 'all' ? '' : `?filter=${filter}`;
    api.get<{ notifications: NotificationItem[]; unreadCount: number }>(`/notifications/${encodeURIComponent(wallet)}${q}`)
      .then((r) => { setNotifications(r.notifications); setUnreadCount(r.unreadCount); })
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [wallet, filter]);

  useEffect(() => {
    setLoading(true);
    fetchNotifications();
  }, [fetchNotifications]);

  const markRead = useCallback(async (id: string) => {
    await api.post(`/notifications/${encodeURIComponent(id)}/read`);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    await api.post('/notifications/read-all');
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  return { notifications, filter, setFilter, unreadCount, markRead, markAllRead, loading };
}
