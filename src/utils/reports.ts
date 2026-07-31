import fs from 'fs';
import path from 'path';

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

const publicDir = path.resolve('./public');

function loadSites(): Array<{ slug: string; name: string; url: string; description?: string; addedAt: string }> {
  const sitesPath = path.join(publicDir, 'sites.json');
  if (!fs.existsSync(sitesPath)) return [];
  return JSON.parse(fs.readFileSync(sitesPath, 'utf-8'));
}

function loadReports(): Map<string, { lastRun: string; duration: number; tests: TestResult[] }> {
  const reportsDir = path.join(publicDir, 'reports');
  const map = new Map();

  if (!fs.existsSync(reportsDir)) return map;

  const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(reportsDir, file), 'utf-8'));
    map.set(data.slug, {
      lastRun: data.lastRun,
      duration: data.duration,
      tests: data.tests,
    });
  }

  return map;
}

function mergeData(): SiteReport[] {
  const sites = loadSites();
  const reports = loadReports();

  return sites.map(site => {
    const report = reports.get(site.slug);

    if (report) {
      return {
        slug: site.slug,
        name: site.name,
        url: site.url,
        description: site.description,
        addedAt: site.addedAt,
        lastRun: report.lastRun,
        duration: report.duration,
        tests: report.tests,
        hasReport: true,
      };
    }

    return {
      slug: site.slug,
      name: site.name,
      url: site.url,
      description: site.description,
      addedAt: site.addedAt,
      lastRun: null,
      duration: 0,
      tests: [],
      hasReport: false,
    };
  });
}

let cachedReports: SiteReport[] | null = null;

function getReports(): SiteReport[] {
  if (!cachedReports) {
    cachedReports = mergeData();
  }
  return cachedReports;
}

export function getAllReports(): SiteReport[] {
  return getReports();
}

export function getReportBySlug(slug: string): SiteReport | undefined {
  return getReports().find(r => r.slug === slug);
}

export function getPassRate(report: SiteReport): number {
  if (!report.hasReport || report.tests.length === 0) return 0;
  const passed = report.tests.filter(t => t.status === 'pass').length;
  return Math.round((passed / report.tests.length) * 100);
}

export function getStatusLevel(rate: number): StatusLevel {
  if (rate >= 80) return 'green';
  if (rate >= 50) return 'yellow';
  return 'red';
}

export function getStatusEmoji(level: StatusLevel): string {
  if (level === 'pending') return '⏳';
  return level === 'green' ? '🟢' : level === 'yellow' ? '🟡' : '🔴';
}

export function getGlobalMetrics(): GlobalMetrics {
  const reports = getReports().filter(r => r.hasReport);
  const totalSites = reports.length;
  let totalTests = 0;
  let totalPassed = 0;

  for (const report of reports) {
    totalTests += report.tests.length;
    totalPassed += report.tests.filter(t => t.status === 'pass').length;
  }

  return {
    totalSites,
    totalTests,
    totalPassed,
    totalFailed: totalTests - totalPassed,
    passRate: totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0,
  };
}

export function getRecentFailures(): Array<{ siteName: string; siteSlug: string; testName: string; error: string }> {
  const failures: Array<{ siteName: string; siteSlug: string; testName: string; error: string }> = [];

  for (const report of getReports()) {
    if (!report.hasReport) continue;
    for (const test of report.tests) {
      if (test.status === 'fail' && test.error) {
        failures.push({
          siteName: report.name,
          siteSlug: report.slug,
          testName: test.name,
          error: test.error,
        });
      }
    }
  }

  return failures;
}

export function formatDuration(ms: number): string {
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  return `${ms}ms`;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
