import { useState, useCallback, useEffect } from 'react';
import { api } from '@/services/api';

export interface ForecastItem {
  drug: string;
  drugCode: string;
  currentStock: number;
  forecast30: number;
  forecast60: number;
  forecast90: number;
  reorderPoint: number;
  needsReorder: boolean;
  trend: 'rising' | 'stable' | 'declining';
  seasonalNote?: string;
}

export interface ReorderAlert {
  drug: string;
  drugCode: string;
  currentStock: number;
  predictedDemand30: number;
  daysUntilStockout: number;
  suggestedOrder: number;
  urgency: 'urgent' | 'soon' | 'planned';
}

export interface ModelInfo {
  name: string;
  version: string;
  lastTrained: string;
  accuracy: number;
  dataPoints: number;
}

export function useForecast() {
  const [forecasts, setForecasts] = useState<ForecastItem[]>([]);
  const [reorderAlerts, setReorderAlerts] = useState<ReorderAlert[]>([]);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [horizon, setHorizon] = useState<30 | 60 | 90>(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ forecasts: ForecastItem[]; reorderAlerts: ReorderAlert[]; model: ModelInfo }>('/ml/forecast')
      .then((r) => {
        setForecasts(r.forecasts ?? []);
        setReorderAlerts(r.reorderAlerts ?? []);
        setModelInfo(r.model ?? null);
      })
      .catch(() => {
        setForecasts([]);
        setReorderAlerts([]);
        setModelInfo(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const getDrugForecast = useCallback(
    (drugCode: string): ForecastItem | undefined => forecasts.find((f) => f.drugCode === drugCode),
    [forecasts],
  );

  const getDemandForHorizon = useCallback(
    (item: ForecastItem): number => {
      if (horizon === 30) return item.forecast30;
      if (horizon === 60) return item.forecast60;
      return item.forecast90;
    },
    [horizon],
  );

  return { forecasts, reorderAlerts, modelInfo, horizon, setHorizon, getDrugForecast, getDemandForHorizon, loading };
}
