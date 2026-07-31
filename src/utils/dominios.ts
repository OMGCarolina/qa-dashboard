import dominiosData from '../data/dominios.json';

export interface Domain {
  domain: string;
  cliente: string;
  registrador: string;
  expires: string;
  renewAuto: boolean;
  dns: string;
  status: string;
  locked: boolean;
  privacy: boolean;
  nameServers: string[];
  createdAt: string;
  expirationProtected: boolean;
  notas: string;
}

export type ExpiryStatus = 'ok' | 'warning' | 'expired';

const allDomains: Domain[] = dominiosData as Domain[];

export function getAllDomains(): Domain[] {
  return allDomains;
}

export function getDaysUntilExpiry(expires: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expires);
  expiry.setHours(0, 0, 0, 0);
  const diff = expiry.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(expires: string): ExpiryStatus {
  const days = getDaysUntilExpiry(expires);
  if (days <= 0) return 'expired';
  if (days <= 90) return 'warning';
  return 'ok';
}

export function getExpiryStatusEmoji(status: ExpiryStatus): string {
  if (status === 'expired') return '🔴';
  if (status === 'warning') return '🟡';
  return '🟢';
}

export function getExpiryStatusColor(status: ExpiryStatus): string {
  if (status === 'expired') return 'text-red-600';
  if (status === 'warning') return 'text-yellow-600';
  return 'text-green-600';
}

export function getExpiryBgColor(status: ExpiryStatus): string {
  if (status === 'expired') return 'bg-red-50 border-red-200';
  if (status === 'warning') return 'bg-yellow-50 border-yellow-200';
  return 'bg-white border-slate-200';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function getDomainMetrics() {
  const domains = allDomains;
  const total = domains.length;
  const active = domains.filter(d => d.status === 'ACTIVE').length;
  const expiring = domains.filter(d => {
    const status = getExpiryStatus(d.expires);
    return status === 'warning';
  }).length;
  const expired = domains.filter(d => getExpiryStatus(d.expires) === 'expired').length;

  return { total, active, expiring, expired };
}
