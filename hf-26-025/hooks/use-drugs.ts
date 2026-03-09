import { useState, useCallback, useMemo, useEffect } from 'react';
import { REGIONS } from '@/constants/medchain';
import { api } from '@/services/api';

export type StockBadge = 'in_stock' | 'low' | 'critical' | 'unavailable';

export interface DrugListing {
  name: string;
  code: string;
  form: string;
  category: string;
  price: number;
  shelfLifeMonths: number;
  manufacturer: string;
  totalStock: number;
  badge: StockBadge;
  pharmacyCount: number;
}

export interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'pharmacy' | 'clinic';
  stock: number;
  distanceKm: number;
  hours: string;
}

export interface DrugDetail extends DrugListing {
  facilities: Facility[];
}

export function useDrugs() {
  const [drugs, setDrugs] = useState<DrugListing[]>([]);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('Chennai');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ drugs: DrugListing[] }>('/drugs')
      .then((res) => setDrugs(res.drugs))
      .catch((err) => console.warn('Failed to load drugs:', err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return drugs.filter((d) => {
      if (!q) return true;
      return d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q);
    });
  }, [drugs, search]);

  const getDrugDetail = useCallback(
    async (code: string): Promise<DrugDetail | undefined> => {
      try {
        return await api.get<DrugDetail>(`/drugs/${code}`);
      } catch {
        return undefined;
      }
    },
    [],
  );

  return { drugs: filtered, search, setSearch, region, setRegion, regions: REGIONS, getDrugDetail, loading };
}
