export interface CheckResult {
  url: string;
  isUp: boolean;
  statusCode: number;
  statusText: string;
  latencyMs: number;
  error?: string;
  lastChecked?: string;
}

export interface ApiResponse {
  status: string;
  checkedAt: string;
  durationSeconds: number;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
  results: CheckResult[];
}