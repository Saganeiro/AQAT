import { Page } from '@playwright/test';
import { NetworkError, LargeResource } from '../types';

export class NetworkMonitor {
  private consoleErrors: string[] = [];
  private networkErrors: NetworkError[] = [];
  private largeResources: LargeResource[] = [];

  constructor(private page: Page) {}

  async startMonitoring(): Promise<void> {
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        this.consoleErrors.push(msg.text());
      }
    });

    this.page.on('response', async (response) => {
      const status = response.status();
      if (status >= 400) {
        this.networkErrors.push({
          url: response.url(),
          status,
          statusText: response.statusText(),
        });
      }

      const contentType = response.headers()['content-type'] || '';
      if (contentType.startsWith('image/')) {
        const contentLength = response.headers()['content-length'];
        if (contentLength) {
          const size = parseInt(contentLength, 10);
          if (size > 1024 * 1024) {
            this.largeResources.push({
              url: response.url(),
              size,
            });
          }
        }
      }
    });
  }

  getResults(): { consoleErrors: string[]; networkErrors: NetworkError[]; largeResources: LargeResource[] } {
    return {
      consoleErrors: this.consoleErrors,
      networkErrors: this.networkErrors,
      largeResources: this.largeResources,
    };
  }
}