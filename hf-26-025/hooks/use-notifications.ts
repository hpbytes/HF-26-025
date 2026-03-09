import { useState, useCallback } from 'react';

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

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1', type: 'stock_alert', title: 'Stock Alert',
    description: 'Insulin is critically low in Chennai. Your prescription needs this medicine.',
    timestamp: '2 hrs ago', group: 'Today', read: false,
    drug: 'Insulin', drugCode: 'INSU', actionLabel: 'Find Stock', actionTarget: 'find_stock',
  },
  {
    id: 'n2', type: 'refill_reminder', title: 'Refill Reminder',
    description: 'Metformin refill due in 5 days — 15 Jul 2024',
    timestamp: '3 hrs ago', group: 'Today', read: false,
    drug: 'Metformin', drugCode: 'METF', actionLabel: 'View Prescription', actionTarget: 'view_prescription',
  },
  {
    id: 'n3', type: 'stock_restored', title: 'Stock Restored',
    description: 'Artemether back in stock at Madurai. Previously low stock.',
    timestamp: 'Yesterday · 14:20', group: 'Yesterday', read: true,
    drug: 'Artemether', drugCode: 'ARTE',
  },
  {
    id: 'n4', type: 'verify_log', title: 'Verification Log',
    description: 'You verified Paracetamol on blockchain — ✅ Authentic · Batch BATCH_TN_PARA_...',
    timestamp: 'Yesterday · 10:15', group: 'Yesterday', read: true,
    drug: 'Paracetamol', drugCode: 'PARA',
  },
  {
    id: 'n5', type: 'low_stock', title: 'Low Stock Warning',
    description: 'Chloroquine stock is running low in Chennai region.',
    timestamp: '2 days ago', group: 'Earlier', read: true,
    drug: 'Chloroquine', drugCode: 'CHLO', actionLabel: 'Find Stock', actionTarget: 'find_stock',
  },
  {
    id: 'n6', type: 'refill_reminder', title: 'Refill Reminder',
    description: 'Amlodipine refill due in 10 days — 20 Jul 2024',
    timestamp: '2 days ago', group: 'Earlier', read: true,
    drug: 'Amlodipine', drugCode: 'AMLO', actionLabel: 'View Prescription', actionTarget: 'view_prescription',
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'stock' | 'refills'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'stock') return n.type === 'stock_alert' || n.type === 'low_stock' || n.type === 'stock_restored';
    if (filter === 'refills') return n.type === 'refill_reminder';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return { notifications: filtered, filter, setFilter, unreadCount, markRead, markAllRead };
}
