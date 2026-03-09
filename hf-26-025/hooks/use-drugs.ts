import { useState, useCallback, useMemo } from 'react';
import { REGIONS } from '@/constants/medchain';

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

function getBadge(qty: number): StockBadge {
  if (qty === 0) return 'unavailable';
  if (qty < 100) return 'critical';
  if (qty <= 500) return 'low';
  return 'in_stock';
}

const MOCK_DRUGS: DrugListing[] = [
  { name: 'Paracetamol', code: 'PARA', form: '500mg tablet', category: 'Analgesic', price: 2, shelfLifeMonths: 36, manufacturer: 'MedCorp TN', totalStock: 4200, badge: 'in_stock', pharmacyCount: 4 },
  { name: 'Metformin', code: 'METF', form: '500mg tablet', category: 'Antidiabetic', price: 5, shelfLifeMonths: 24, manufacturer: 'PharmaCorp', totalStock: 3200, badge: 'in_stock', pharmacyCount: 2 },
  { name: 'Amoxicillin', code: 'AMOX', form: '500mg capsule', category: 'Antibiotic', price: 8, shelfLifeMonths: 24, manufacturer: 'MediGen Labs', totalStock: 1800, badge: 'in_stock', pharmacyCount: 3 },
  { name: 'Amlodipine', code: 'AMLO', form: '5mg tablet', category: 'Antihypertensive', price: 4, shelfLifeMonths: 36, manufacturer: 'PharmaCorp', totalStock: 950, badge: 'in_stock', pharmacyCount: 2 },
  { name: 'Artemether', code: 'ARTE', form: '20mg tablet', category: 'Antimalarial', price: 45, shelfLifeMonths: 18, manufacturer: 'MediGen Labs', totalStock: 180, badge: 'low', pharmacyCount: 1 },
  { name: 'Chloroquine', code: 'CHLO', form: '250mg tablet', category: 'Antimalarial', price: 12, shelfLifeMonths: 24, manufacturer: 'BioPharm India', totalStock: 150, badge: 'low', pharmacyCount: 1 },
  { name: 'Insulin', code: 'INSU', form: '100IU/ml vial', category: 'Antidiabetic', price: 180, shelfLifeMonths: 12, manufacturer: 'BioPharm India', totalStock: 42, badge: 'critical', pharmacyCount: 0 },
  { name: 'Ibuprofen', code: 'IBUP', form: '400mg tablet', category: 'Analgesic', price: 3, shelfLifeMonths: 36, manufacturer: 'MedCorp TN', totalStock: 2800, badge: 'in_stock', pharmacyCount: 3 },
  { name: 'Omeprazole', code: 'OMEP', form: '20mg capsule', category: 'Antacid', price: 6, shelfLifeMonths: 24, manufacturer: 'PharmaCorp', totalStock: 1400, badge: 'in_stock', pharmacyCount: 2 },
  { name: 'Ciprofloxacin', code: 'CIPR', form: '500mg tablet', category: 'Antibiotic', price: 10, shelfLifeMonths: 24, manufacturer: 'MediGen Labs', totalStock: 600, badge: 'in_stock', pharmacyCount: 2 },
  { name: 'Salbutamol', code: 'SALB', form: '100mcg inhaler', category: 'Bronchodilator', price: 95, shelfLifeMonths: 24, manufacturer: 'BioPharm India', totalStock: 320, badge: 'low', pharmacyCount: 1 },
  { name: 'Ondansetron', code: 'ONDA', form: '4mg tablet', category: 'Antiemetic', price: 15, shelfLifeMonths: 24, manufacturer: 'PharmaCorp', totalStock: 0, badge: 'unavailable', pharmacyCount: 0 },
];

const MOCK_FACILITIES: Record<string, Facility[]> = {
  PARA: [
    { id: 'f1', name: 'Govt Hospital Chennai', type: 'hospital', stock: 2000, distanceKm: 1.2, hours: '24 hours' },
    { id: 'f2', name: 'MedPlus Pharmacy', type: 'pharmacy', stock: 800, distanceKm: 0.4, hours: '8AM – 10PM' },
    { id: 'f3', name: 'Apollo Pharmacy', type: 'pharmacy', stock: 600, distanceKm: 2.1, hours: '9AM – 9PM' },
    { id: 'f4', name: 'City Clinic', type: 'clinic', stock: 800, distanceKm: 3.5, hours: '9AM – 6PM' },
  ],
  METF: [
    { id: 'f1', name: 'Govt Hospital Chennai', type: 'hospital', stock: 1200, distanceKm: 1.2, hours: '24 hours' },
    { id: 'f5', name: 'MedPlus Anna Nagar', type: 'pharmacy', stock: 2000, distanceKm: 0.4, hours: '8AM – 10PM' },
  ],
  INSU: [
    { id: 'f1', name: 'Govt Hospital Chennai', type: 'hospital', stock: 42, distanceKm: 1.2, hours: '24 hours' },
  ],
  ARTE: [
    { id: 'f6', name: 'Tropical Med Centre', type: 'clinic', stock: 180, distanceKm: 4.2, hours: '9AM – 5PM' },
  ],
};

function getDefaultFacilities(drug: DrugListing): Facility[] {
  return [
    { id: 'fd1', name: 'Govt Hospital Chennai', type: 'hospital', stock: Math.floor(drug.totalStock * 0.5), distanceKm: 1.2, hours: '24 hours' },
    { id: 'fd2', name: 'Apollo Pharmacy', type: 'pharmacy', stock: Math.floor(drug.totalStock * 0.3), distanceKm: 2.1, hours: '9AM – 9PM' },
  ];
}

export function useDrugs() {
  const [drugs] = useState<DrugListing[]>(MOCK_DRUGS);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('Chennai');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return drugs.filter((d) => {
      if (!q) return true;
      return d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q);
    });
  }, [drugs, search]);

  const getDrugDetail = useCallback(
    (code: string): DrugDetail | undefined => {
      const drug = drugs.find((d) => d.code === code);
      if (!drug) return undefined;
      const facilities = MOCK_FACILITIES[code] || getDefaultFacilities(drug);
      return { ...drug, facilities };
    },
    [drugs],
  );

  return { drugs: filtered, search, setSearch, region, setRegion, regions: REGIONS, getDrugDetail };
}
