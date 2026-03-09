import { useState, useCallback } from 'react';
import type { StockBadge } from '@/hooks/use-drugs';

export type PrescriptionStatus = 'active' | 'past';

export interface PrescriptionItem {
  id: string;
  drug: string;
  drugCode: string;
  form: string;
  dosage: string;
  doctor: string;
  hospital: string;
  prescribedDate: string;
  duration: string;
  status: PrescriptionStatus;
  refillsTotal: number;
  refillsUsed: number;
  nextRefillDate?: string;
  completedDate?: string;
  stockBadge: StockBadge;
  stockQty: number;
}

export interface PrescriptionDetail extends PrescriptionItem {
  nearbyFacilities: { name: string; distanceKm: number }[];
}

const MOCK_PRESCRIPTIONS: PrescriptionItem[] = [
  {
    id: 'rx1', drug: 'Metformin', drugCode: 'METF', form: '500mg', dosage: 'Twice daily',
    doctor: 'Dr. Rajan Kumar', hospital: 'City Hospital TN', prescribedDate: '15 Jan 2024',
    duration: 'Ongoing', status: 'active', refillsTotal: 3, refillsUsed: 1,
    nextRefillDate: '15 Jul 2024', stockBadge: 'in_stock', stockQty: 1200,
  },
  {
    id: 'rx2', drug: 'Amlodipine', drugCode: 'AMLO', form: '5mg', dosage: 'Once daily',
    doctor: 'Dr. Rajan Kumar', hospital: 'City Hospital TN', prescribedDate: '15 Jan 2024',
    duration: 'Ongoing', status: 'active', refillsTotal: 3, refillsUsed: 2,
    nextRefillDate: '20 Jul 2024', stockBadge: 'in_stock', stockQty: 950,
  },
  {
    id: 'rx3', drug: 'Insulin', drugCode: 'INSU', form: '100IU', dosage: 'As prescribed',
    doctor: 'Dr. Rajan Kumar', hospital: 'City Hospital TN', prescribedDate: '15 Jan 2024',
    duration: 'Ongoing', status: 'active', refillsTotal: 6, refillsUsed: 3,
    nextRefillDate: '10 Jul 2024', stockBadge: 'critical', stockQty: 42,
  },
  {
    id: 'rx4', drug: 'Amoxicillin', drugCode: 'AMOX', form: '500mg', dosage: '3x daily',
    doctor: 'Dr. Meena', hospital: 'City Hospital TN', prescribedDate: '5 Dec 2023',
    duration: '7 days', status: 'past', refillsTotal: 0, refillsUsed: 0,
    completedDate: 'Jan 2024', stockBadge: 'in_stock', stockQty: 1800,
  },
  {
    id: 'rx5', drug: 'Ciprofloxacin', drugCode: 'CIPR', form: '500mg', dosage: 'Twice daily',
    doctor: 'Dr. Meena', hospital: 'City Hospital TN', prescribedDate: '10 Oct 2023',
    duration: '10 days', status: 'past', refillsTotal: 0, refillsUsed: 0,
    completedDate: 'Oct 2023', stockBadge: 'in_stock', stockQty: 600,
  },
];

const MOCK_FACILITIES: Record<string, { name: string; distanceKm: number }[]> = {
  rx1: [
    { name: 'MedPlus Anna Nagar', distanceKm: 0.4 },
    { name: 'Apollo T Nagar', distanceKm: 1.2 },
    { name: 'Govt Hospital', distanceKm: 1.8 },
  ],
  rx2: [
    { name: 'Apollo T Nagar', distanceKm: 1.2 },
    { name: 'MedPlus Anna Nagar', distanceKm: 0.4 },
  ],
  rx3: [
    { name: 'Govt Hospital', distanceKm: 1.8 },
  ],
};

export function usePrescriptions() {
  const [prescriptions] = useState<PrescriptionItem[]>(MOCK_PRESCRIPTIONS);
  const [filter, setFilter] = useState<'all' | 'active' | 'past'>('all');

  const filtered = prescriptions.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const active = prescriptions.filter((p) => p.status === 'active');
  const past = prescriptions.filter((p) => p.status === 'past');

  const getDetail = useCallback(
    (id: string): PrescriptionDetail | undefined => {
      const rx = prescriptions.find((p) => p.id === id);
      if (!rx) return undefined;
      const nearbyFacilities = MOCK_FACILITIES[id] || [
        { name: 'Apollo Pharmacy', distanceKm: 2.1 },
      ];
      return { ...rx, nearbyFacilities };
    },
    [prescriptions],
  );

  return { prescriptions: filtered, active, past, filter, setFilter, getDetail };
}
