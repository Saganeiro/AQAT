import { test } from '@playwright/test';
import { AuditRunner } from '../src/AuditRunner';
import { CustomReporter } from '../src/CustomReporter';

test('Run Quality Audit', async ({ page }) => {
  const url = process.env.AUDIT_URL || 'https://example.com';
  const auditRunner = new AuditRunner(page);
  const result = await auditRunner.runAudit(url);
  CustomReporter.generateReport(result);
  await CustomReporter.generatePDFReport(result, page, url);

  test.expect(result.consoleErrors.length).toBeLessThanOrEqual(10);
});