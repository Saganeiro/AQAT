import { Page } from '@playwright/test';
import { AuditResult } from './types';
import { NetworkMonitor } from './modules/NetworkMonitor';
import { LinkChecker } from './modules/LinkChecker';
import { AccessibilityChecker } from './modules/AccessibilityChecker';
import { PerformanceMetrics } from './modules/PerformanceMetrics';
import { VisualRegression } from './modules/VisualRegression';

export class AuditRunner {
  private networkMonitor: NetworkMonitor;
  private linkChecker: LinkChecker;
  private accessibilityChecker: AccessibilityChecker;
  private performanceMetrics: PerformanceMetrics;
  private visualRegression: VisualRegression;

  constructor(private page: Page) {
    this.networkMonitor = new NetworkMonitor(page);
    this.linkChecker = new LinkChecker(page);
    this.accessibilityChecker = new AccessibilityChecker(page);
    this.performanceMetrics = new PerformanceMetrics(page);
    this.visualRegression = new VisualRegression(page);
  }

  async runAudit(url: string): Promise<AuditResult> {
    await this.page.goto(url);

    await this.networkMonitor.startMonitoring();

    await this.page.waitForLoadState('networkidle');

    const [brokenLinks, accessibilityIssues, performanceMetrics, visualRegressionPassed] = await Promise.all([
      this.linkChecker.checkLinks(),
      this.accessibilityChecker.runAudit(),
      this.performanceMetrics.getMetrics(),
      this.visualRegression.runComparison(url),
    ]);

    const { consoleErrors, networkErrors, largeResources } = this.networkMonitor.getResults();

    return {
      consoleErrors,
      networkErrors,
      largeResources,
      brokenLinks,
      accessibilityIssues,
      performanceMetrics,
      visualRegressionPassed,
    };
  }
}