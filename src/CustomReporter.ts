import { AuditResult } from './types';
import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class CustomReporter {
  static generateReport(result: AuditResult): void {
    console.log('=== Automated Quality Audit Report ===');
    console.log(`Console Errors: ${result.consoleErrors.length}`);
    console.log(`Network Errors: ${result.networkErrors.length}`);
    console.log(`Large Resources (>1MB): ${result.largeResources.length}`);
    console.log(`Broken Links: ${result.brokenLinks.length}`);
    console.log(`Accessibility Issues: ${result.accessibilityIssues.length}`);
    console.log(`Performance - LCP: ${result.performanceMetrics.lcp}ms, FCP: ${result.performanceMetrics.fcp}ms`);
    console.log(`Visual Regression Passed: ${result.visualRegressionPassed ? 'Yes' : 'No'}`);
    console.log('======================================');
  }

  static async generatePDFReport(result: AuditResult, page: Page, url: string, fileName?: string): Promise<void> {
    const html = this.generateHTMLReport(result, url);
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    const finalFileName = fileName || this.generateFileName(url, 'pdf');
    const filePath = path.join(process.cwd(), 'reports', finalFileName);
    fs.writeFileSync(filePath, pdfBuffer);
    console.log(`PDF report saved to: ${filePath}`);
  }

  private static generateFileName(url: string, extension: string): string {
    const domain = new URL(url).hostname.replace(/\./g, '-');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5); // YYYY-MM-DDTHH-MM-SS
    return `${domain}_${timestamp}.${extension}`;
  }

  private static generateHTMLReport(result: AuditResult, url: string): string {
    const date = new Date().toLocaleString();
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Automated Quality Audit Report</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            color: #333;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
          }
          .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          .card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
          }
          .card h3 {
            margin: 0 0 10px 0;
            color: #555;
            font-size: 1.1em;
          }
          .card .value {
            font-size: 2em;
            font-weight: bold;
            margin: 0;
          }
          .success { color: #28a745; }
          .warning { color: #ffc107; }
          .error { color: #dc3545; }
          .section {
            background: white;
            margin-bottom: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .section h2 {
            background: #f8f9fa;
            margin: 0;
            padding: 15px 20px;
            border-bottom: 1px solid #dee2e6;
            font-size: 1.4em;
            color: #495057;
          }
          .section-content {
            padding: 20px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #dee2e6;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #495057;
          }
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          ul {
            padding-left: 20px;
          }
          li {
            margin-bottom: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #6c757d;
            font-size: 0.9em;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Automated Quality Audit Tool</h1>
          <p>Report for: ${url} | Generated on: ${date}</p>
        </div>

        <div class="summary">
          <div class="card">
            <h3>Console Errors</h3>
            <p class="value ${result.consoleErrors.length === 0 ? 'success' : 'error'}">${result.consoleErrors.length}</p>
          </div>
          <div class="card">
            <h3>Network Errors</h3>
            <p class="value ${result.networkErrors.length === 0 ? 'success' : 'error'}">${result.networkErrors.length}</p>
          </div>
          <div class="card">
            <h3>Large Resources</h3>
            <p class="value ${result.largeResources.length === 0 ? 'success' : 'warning'}">${result.largeResources.length}</p>
          </div>
          <div class="card">
            <h3>Broken Links</h3>
            <p class="value ${result.brokenLinks.length === 0 ? 'success' : 'error'}">${result.brokenLinks.length}</p>
          </div>
          <div class="card">
            <h3>Accessibility Issues</h3>
            <p class="value ${result.accessibilityIssues.length === 0 ? 'success' : 'warning'}">${result.accessibilityIssues.length}</p>
          </div>
          <div class="card">
            <h3>Performance</h3>
            <p class="value success">LCP: ${result.performanceMetrics.lcp.toFixed(1)}ms<br>FCP: ${result.performanceMetrics.fcp.toFixed(1)}ms</p>
          </div>
          <div class="card">
            <h3>Visual Regression</h3>
            <p class="value ${result.visualRegressionPassed ? 'success' : 'error'}">${result.visualRegressionPassed ? 'Passed' : 'Failed'}</p>
          </div>
        </div>

        ${result.consoleErrors.length > 0 ? `
        <div class="section">
          <h2>Console Errors</h2>
          <div class="section-content">
            <ul>
              ${result.consoleErrors.map(error => `<li>${error}</li>`).join('')}
            </ul>
          </div>
        </div>
        ` : ''}

        ${result.networkErrors.length > 0 ? `
        <div class="section">
          <h2>Network Errors</h2>
          <div class="section-content">
            <table>
              <tr><th>URL</th><th>Status</th><th>Status Text</th></tr>
              ${result.networkErrors.map(error => `<tr><td>${error.url}</td><td>${error.status}</td><td>${error.statusText}</td></tr>`).join('')}
            </table>
          </div>
        </div>
        ` : ''}

        ${result.largeResources.length > 0 ? `
        <div class="section">
          <h2>Large Resources (>1MB)</h2>
          <div class="section-content">
            <table>
              <tr><th>URL</th><th>Size (bytes)</th></tr>
              ${result.largeResources.map(resource => `<tr><td>${resource.url}</td><td>${resource.size.toLocaleString()}</td></tr>`).join('')}
            </table>
          </div>
        </div>
        ` : ''}

        ${result.brokenLinks.length > 0 ? `
        <div class="section">
          <h2>Broken Links</h2>
          <div class="section-content">
            <table>
              <tr><th>URL</th><th>Status</th><th>Status Text</th></tr>
              ${result.brokenLinks.map(link => `<tr><td>${link.url}</td><td>${link.status}</td><td>${link.statusText}</td></tr>`).join('')}
            </table>
          </div>
        </div>
        ` : ''}

        ${result.accessibilityIssues.length > 0 ? `
        <div class="section">
          <h2>Accessibility Issues</h2>
          <div class="section-content">
            <table>
              <tr><th>Rule</th><th>Description</th><th>Impact</th></tr>
              ${result.accessibilityIssues.map(issue => `<tr><td>${issue.rule}</td><td>${issue.description}</td><td>${issue.impact}</td></tr>`).join('')}
            </table>
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p>Generated by Automated Quality Audit Tool</p>
        </div>
      </body>
      </html>
    `;
  }
}