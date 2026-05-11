export interface AuditResult {
  consoleErrors: string[];
  networkErrors: NetworkError[];
  largeResources: LargeResource[];
  brokenLinks: BrokenLink[];
  accessibilityIssues: AccessibilityIssue[];
  performanceMetrics: PerformanceMetric;
  visualRegressionPassed: boolean;
}

export interface NetworkError {
  url: string;
  status: number;
  statusText: string;
}

export interface LargeResource {
  url: string;
  size: number; // in bytes
}

export interface BrokenLink {
  url: string;
  status: number;
  statusText: string;
}

export interface AccessibilityIssue {
  rule: string;
  description: string;
  impact: string;
  nodes: any[];
}

export interface PerformanceMetric {
  lcp: number; // in ms
  fcp: number; // in ms
}