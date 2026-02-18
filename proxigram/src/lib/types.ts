
export interface ProxyConfig {
  id: string;
  ipAddress: string;
  port: number;
  location: string;
  estimatedLatencyMs: number;
  estimatedThroughputMbps: number;
  currentLoad: number;
  username?: string;
  password?: string;
  encryptionKey?: string;
  isInternal?: boolean;
}

export interface HealthMetrics {
  timestamp: number;
  latency: number;
  successRate: number;
  throughput: number;
  uptime: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
  type: 'text' | 'file';
  fileName?: string;
  fileSize?: string;
  status?: 'pending' | 'success' | 'failed';
}
