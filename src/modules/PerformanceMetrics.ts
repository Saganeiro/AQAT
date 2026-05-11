import { Page } from '@playwright/test';
import { PerformanceMetric } from '../types';

export class PerformanceMetrics {
  constructor(private page: Page) {}

  async getMetrics(): Promise<PerformanceMetric> {
    const metrics = await this.page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const lcp = nav.loadEventEnd - nav.fetchStart;

      return {
        lcp,
        fcp,
      };
    });

    return metrics;
  }
}