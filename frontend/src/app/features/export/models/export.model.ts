export type ExportFormat = 'csv' | 'json';

export interface ExportRequest {
  format: ExportFormat;
  category_id?: string;
  include_deleted?: boolean;
}

export interface ExportResult {
  format: ExportFormat;
  file_name: string;
  record_count: number;
  exported_at: string;
}
