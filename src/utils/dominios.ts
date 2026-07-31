import dominiosData from '../data/dominios.json';

export interface Domain {
  domain: string;
  registrador: string;
  propiedad: string;
  renovacionActiva: boolean;
  fechaRegistro: string;
  fechaExpiracion: string;
  estadoExpiracion: string;
  usuario: string;
  contraseña: string;
  cuentaDelegada: string;
  costoRenovacion: string;
}

export type ExpiryStatus = 'ok' | 'warning' | 'expired';

const allDomains: Domain[] = dominiosData as Domain[];

export function getAllDomains(): Domain[] {
  return allDomains;
}

export function getDaysUntilExpiry(fechaExpiracion: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(fechaExpiracion);
  expiry.setHours(0, 0, 0, 0);
  const diff = expiry.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(estadoExpiracion: string): ExpiryStatus {
  const estado = estadoExpiracion.toUpperCase();
  if (estado === 'VENCIDO' || estado === 'EXPIRADO') return 'expired';
  if (estado === 'POR VENCER') return 'warning';
  return 'ok';
}

export function getExpiryStatusFromDomain(domain: Domain): ExpiryStatus {
  const status = getExpiryStatus(domain.estadoExpiracion);
  if (status !== 'ok') return status;

  const days = getDaysUntilExpiry(domain.fechaExpiracion);
  if (days <= 0) return 'expired';
  if (days <= 90) return 'warning';
  return 'ok';
}

export function getExpiryStatusEmoji(status: ExpiryStatus): string {
  if (status === 'expired') return '🔴';
  if (status === 'warning') return '🟡';
  return '🟢';
}

export function getExpiryStatusLabel(status: ExpiryStatus): string {
  if (status === 'expired') return 'VENCIDO';
  if (status === 'warning') return 'POR VENCER';
  return 'VIGENTE';
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

export function maskPassword(contraseña: string): string {
  if (!contraseña || contraseña === '••••••••') return '••••••••';
  return '•••' + contraseña.slice(-3);
}

export function getDomainMetrics() {
  const domains = allDomains;
  const total = domains.length;
  const vigentes = domains.filter(d => getExpiryStatusFromDomain(d) === 'ok').length;
  const porVencer = domains.filter(d => getExpiryStatusFromDomain(d) === 'warning').length;
  const vencidos = domains.filter(d => getExpiryStatusFromDomain(d) === 'expired').length;

  return { total, vigentes, porVencer, vencidos };
}
