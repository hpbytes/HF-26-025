import { API_BASE } from '@/constants/api';

let _wallet: string | null = null;

export function setApiWallet(wallet: string | null) {
  _wallet = wallet;
}

export function getApiWallet(): string | null {
  return _wallet;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (_wallet) {
    headers['x-wallet-address'] = _wallet;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const res = await fetch(url, { ...options, headers, signal: controller.signal }).finally(() =>
    clearTimeout(timeoutId)
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `API error ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
};

// Fetch demo wallets from backend (reads deployed.json)
export interface DemoWallets {
  manufacturer: string;
  distributor: string;
  patient: string | null;
}

export async function fetchDemoWallets(): Promise<DemoWallets> {
  return api.get<DemoWallets>('/demo-wallets');
}
