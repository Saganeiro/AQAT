import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { AccessibilityIssue } from '../types';

export class AccessibilityChecker {
  constructor(private page: Page) {}

  async runAudit(): Promise<AccessibilityIssue[]> {
    const axe = new AxeBuilder({ page: this.page });
    const results = await axe.analyze();

    return results.violations.map((violation) => ({
      rule: violation.id,
      description: violation.description,
      impact: violation.impact,
      nodes: violation.nodes,
    }));
  }
}