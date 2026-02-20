export interface ImportSession {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_name: string;
  file_type: 'csv' | 'json';
  total_records: number;
  success_count: number;
  error_count: number;
  errors?: ImportError[];
  created_at: string;
  completed_at?: string;
}

export interface ImportError {
  row?: number;
  field?: string;
  message: string;
  value?: string;
}

export interface ImportProgress {
  sessionId: string;
  status: ImportSession['status'];
  total: number;
  processed: number;
  success: number;
  failed: number;
  errors: ImportError[];
}
