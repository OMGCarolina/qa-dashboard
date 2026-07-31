import sitesData from '../data/sites.json';
import reportJerseyCanna from '../data/reports/jersey-canna.json';
import reportJerseyleaf from '../data/reports/jerseyleaf.json';
import reportCosmopolitaderma from '../data/reports/cosmopolitaderma.json';

export interface TestResult {
  name: string;
  status: 'pass' | 'fail';
  duration: number;
  error?: string;
}

export interface SiteReport {
  slug: string;
  name: string;
  url: string;
  description?: string;
  addedAt: string;
  lastRun: string | null;
  duration: number;
  tests: TestResult[];
  hasReport: boolean;
}

export interface GlobalMetrics {
  totalSites: number;
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  passRate: number;
}

export type StatusLevel = 'green' | 'yellow' | 'red' | 'pending';

interface SiteEntry {
  slug: string;
  name: string;
  url: string;
  description?: string;
  addedAt: string;
}

interface ReportData {
  slug: string;
  lastRun: string;
  duration: number;
  tests: TestResult[];
}

const allSites: SiteEntry[] = sitesData as SiteEntry[];
const reportsMap = new Map<string, ReportData>();
const reportFiles: ReportData[] = [
  reportJerseyCanna as ReportData,
  reportJerseyleaf as ReportData,
  reportCosmopolitaderma as ReportData,
];
for (const report of reportFiles) {
  reportsMap.set(report.slug, report);
}

function mergeData(): SiteReport[] {
  return allSites.map(site => {
    const report = reportsMap.get(site.slug);
    if (report) {
      return { slug: site.slug, name: site.name, url: site.url, description: site.description, addedAt: site.addedAt, lastRun: report.lastRun, duration: report.duration, tests: report.tests, hasReport: true };
    }
    return { slug: site.slug, name: site.name, url: site.url, description: site.description, addedAt: site.addedAt, lastRun: null, duration: 0, tests: [], hasReport: false };
  });
}

let cachedReports: SiteReport[] | null = null;
function getReports(): SiteReport[] {
  if (!cachedReports) cachedReports = mergeData();
  return cachedReports;
}

export function getAllReports(): SiteReport[] { return getReports(); }
export function getReportBySlug(slug: string): SiteReport | undefined { return getReports().find(r => r.slug === slug); }
export function getPassRate(report: SiteReport): number {
  if (!report.hasReport || report.tests.length === 0) return 0;
  return Math.round((report.tests.filter(t => t.status === 'pass').length / report.tests.length) * 100);
}
export function getStatusLevel(rate: number): StatusLevel { return rate >= 80 ? 'green' : rate >= 50 ? 'yellow' : 'red'; }
export function getStatusEmoji(level: StatusLevel): string { return level === 'pending' ? '⏳' : level === 'green' ? '🟢' : level === 'yellow' ? '🟡' : '🔴'; }
export function getGlobalMetrics(): GlobalMetrics {
  const reports = getReports().filter(r => r.hasReport);
  let totalTests = 0, totalPassed = 0;
  for (const r of reports) { totalTests += r.tests.length; totalPassed += r.tests.filter(t => t.status === 'pass').length; }
  return { totalSites: reports.length, totalTests, totalPassed, totalFailed: totalTests - totalPassed, passRate: totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0 };
}
export function getRecentFailures(): Array<{ siteName: string; siteSlug: string; testName: string; error: string }> {
  const failures: Array<{ siteName: string; siteSlug: string; testName: string; error: string }> = [];
  for (const report of getReports()) {
    if (!report.hasReport) continue;
    for (const test of report.tests) {
      if (test.status === 'fail' && test.error) failures.push({ siteName: report.name, siteSlug: report.slug, testName: test.name, error: test.error });
    }
  }
  return failures;
}
export function formatDuration(ms: number): string { return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`; }
export function generateSlug(name: string): string { return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
export function formatDate(isoString: string): string { return new Date(isoString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
