import { Page } from '@playwright/test';
import { BrokenLink } from '../types';

export class LinkChecker {
  constructor(private page: Page) {}

  async checkLinks(): Promise<BrokenLink[]> {
    const links = await this.page.$$eval('a[href]', (anchors) =>
      anchors.map((a) => (a as HTMLAnchorElement).href).filter(href => href.startsWith('http'))
    );

    const brokenLinks: BrokenLink[] = [];

    const promises = links.map(async (url) => {
      try {
        const response = await this.page.request.head(url);
        if (response.status() >= 400) {
          brokenLinks.push({
            url,
            status: response.status(),
            statusText: response.statusText(),
          });
        }
      } catch (error) {
        brokenLinks.push({
          url,
          status: 0,
          statusText: 'Request failed',
        });
      }
    });

    await Promise.all(promises);
    return brokenLinks;
  }
}