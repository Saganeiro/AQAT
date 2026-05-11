# Automated Quality Audit Tool

Advanced modular framework for automated website quality audits using Playwright and TypeScript. This enterprise-grade tool performs comprehensive audits of web pages, checking for technical issues, accessibility compliance, performance metrics, and visual regressions.

## Features

### Core Audit Modules

- **Technical Guard**: Monitors JavaScript console errors and network responses for 4xx/5xx errors and large resources (>1MB)
- **Broken Link Checker**: Intelligent crawler that extracts and validates all internal links using multi-threaded HTTP HEAD requests
- **Accessibility Audit (A11y)**: Automated WCAG 2.1 compliance scanning using @axe-core/playwright
- **Performance Metrics**: Extracts Web Vitals including LCP (Largest Contentful Paint) and FCP (First Contentful Paint)
- **Visual Regression**: Full-page screenshot comparison with baseline snapshots

### Reporting

- **Console Report**: Real-time summary in terminal with error counts
- **PDF Report**: Professional, styled PDF report with detailed tables and metrics
- **HTML Report**: Playwright's built-in HTML test reports

## Architecture

### Modular Design

The framework follows clean architecture principles with separate modules in `src/modules/`:

```
src/
├── modules/
│   ├── NetworkMonitor.ts      # Console and network monitoring
│   ├── LinkChecker.ts         # Link validation
│   ├── AccessibilityChecker.ts # Axe-core integration
│   ├── PerformanceMetrics.ts  # Web Vitals extraction
│   └── VisualRegression.ts    # Screenshot comparison
├── AuditRunner.ts             # Main orchestrator
├── CustomReporter.ts          # Report generation
└── types.ts                   # TypeScript interfaces
```

### Key Principles

- **Modularity**: Each audit type is a separate class for easy maintenance and extension
- **Type Safety**: Full TypeScript with strong typing and interfaces
- **Clean Code**: Singleton/static utilities where appropriate, enterprise patterns
- **CI/CD Ready**: Parallel execution, HTML reports, configurable via environment variables

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   npx playwright install
   ```

## Usage

### Basic Audit

Set the URL and run the audit:

```bash
set AUDIT_URL=https://example.com
npx playwright test tests/audit.spec.ts --headed
```

### Environment Variables

- `AUDIT_URL`: The URL to audit (default: https://example.com)

### Output

- **Console**: Summary report with counts
- **PDF**: `reports/{domain}_{timestamp}.pdf` - detailed styled report (e.g., example-com_2026-05-11T20-45-32.pdf)
- **Screenshots**: `screenshots/{domain}.png` - visual regression baselines (e.g., example-com.png)

## Project Structure

```
automated-quality-audit-tool/
├── src/
│   ├── modules/               # Audit modules
│   ├── AuditRunner.ts         # Main audit orchestrator
│   ├── CustomReporter.ts      # Report generation
│   └── types.ts               # Type definitions
├── tests/
│   └── audit.spec.ts          # Main test spec
├── reports/                   # Generated PDF reports
├── screenshots/               # Visual regression baselines
├── playwright.config.ts       # Playwright configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## Dependencies

- **@playwright/test**: Browser automation and testing framework
- **@axe-core/playwright**: Accessibility testing integration
- **typescript**: Type safety and modern JavaScript features

## Configuration

### Playwright Config

- `fullyParallel: true` - Parallel test execution
- `reporter: [['html'], ['list']]` - HTML and console reporting
- Chromium browser for consistent results

### Extending the Framework

Add new audit modules by:

1. Creating a new class in `src/modules/`
2. Implementing the audit logic
3. Adding results to `AuditResult` interface
4. Integrating in `AuditRunner.runAudit()`
5. Updating `CustomReporter` for output

## CI/CD Integration

The tool is designed for CI/CD pipelines:

- Parallel execution for faster runs
- Environment variable configuration
- HTML reports for artifact storage
- Exit codes indicate test success/failure

## Example Output

```
=== Automated Quality Audit Report ===
Console Errors: 1
Network Errors: 0
Large Resources (>1MB): 0
Broken Links: 0
Accessibility Issues: 2
Performance - LCP: 105.5ms, FCP: 176ms
Visual Regression Passed: Yes
======================================
PDF report saved to: C:\path\to\audit-report.pdf
```

## Contributing

1. Follow TypeScript best practices
2. Add tests for new modules
3. Update documentation
4. Maintain modular architecture

## License

MIT License - see package.json for details

</content>