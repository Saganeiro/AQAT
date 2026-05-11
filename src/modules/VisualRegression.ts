import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class VisualRegression {
  constructor(private page: Page) {}

  async runComparison(url: string, snapshotName?: string): Promise<boolean> {
    const finalSnapshotName = snapshotName || this.generateSnapshotName(url);
    const snapshotPath = path.join(__dirname, '../../screenshots', `${finalSnapshotName}.png`);
    const screenshot = await this.page.screenshot();

    if (!fs.existsSync(snapshotPath)) {
      fs.writeFileSync(snapshotPath, screenshot);
      return true;
    }

    const baseline = fs.readFileSync(snapshotPath);
    return screenshot.length === baseline.length;
  }

  private generateSnapshotName(url: string): string {
    return new URL(url).hostname.replace(/\./g, '-');
  }
}