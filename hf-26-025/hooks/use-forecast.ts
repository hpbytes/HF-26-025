import { useState, useCallback } from 'react';

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

const MOCK_FORECASTS: ForecastItem[] = [
  { drug: 'Paracetamol', drugCode: 'PARA', currentStock: 4200, forecast30: 3500, forecast60: 7200, forecast90: 10800, reorderPoint: 2000, needsReorder: false, trend: 'stable' },
  { drug: 'Artemether', drugCode: 'ARTE', currentStock: 180, forecast30: 400, forecast60: 850, forecast90: 1200, reorderPoint: 300, needsReorder: true, trend: 'rising', seasonalNote: 'Monsoon season increases malaria drug demand by ~40%' },
  { drug: 'Insulin', drugCode: 'INSU', currentStock: 42, forecast30: 300, forecast60: 620, forecast90: 950, reorderPoint: 200, needsReorder: true, trend: 'stable' },
  { drug: 'Amoxicillin', drugCode: 'AMOX', currentStock: 1800, forecast30: 1200, forecast60: 2500, forecast90: 3600, reorderPoint: 800, needsReorder: false, trend: 'stable' },
  { drug: 'Metformin', drugCode: 'METF', currentStock: 3200, forecast30: 1800, forecast60: 3400, forecast90: 5100, reorderPoint: 1500, needsReorder: false, trend: 'rising' },
  { drug: 'Chloroquine', drugCode: 'CHLO', currentStock: 150, forecast30: 350, forecast60: 700, forecast90: 1050, reorderPoint: 250, needsReorder: true, trend: 'rising', seasonalNote: 'Seasonal uptick expected in monsoon regions' },
];

const MOCK_REORDER_ALERTS: ReorderAlert[] = [
  { drug: 'Insulin', drugCode: 'INSU', currentStock: 42, predictedDemand30: 300, daysUntilStockout: 4, suggestedOrder: 500, urgency: 'urgent' },
  { drug: 'Artemether', drugCode: 'ARTE', currentStock: 180, predictedDemand30: 400, daysUntilStockout: 13, suggestedOrder: 400, urgency: 'soon' },
  { drug: 'Chloroquine', drugCode: 'CHLO', currentStock: 150, predictedDemand30: 350, daysUntilStockout: 12, suggestedOrder: 500, urgency: 'soon' },
];

const MOCK_MODEL: ModelInfo = {
  name: 'MedChain Demand Predictor',
  version: 'v2.1.0',
  lastTrained: '1 Jun 2024',
  accuracy: 0.87,
  dataPoints: 12480,
};

export function useForecast() {
  const [forecasts] = useState<ForecastItem[]>(MOCK_FORECASTS);
  const [reorderAlerts] = useState<ReorderAlert[]>(MOCK_REORDER_ALERTS);
  const [modelInfo] = useState<ModelInfo>(MOCK_MODEL);
  const [horizon, setHorizon] = useState<30 | 60 | 90>(30);

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

  return { forecasts, reorderAlerts, modelInfo, horizon, setHorizon, getDrugForecast, getDemandForHorizon };
}
