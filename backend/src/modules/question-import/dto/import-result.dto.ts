export class ImportErrorDto {
  rowNumber: number;
  errorType: string;
  message: string;
}

export class ImportResultDto {
  sessionId: string;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: ImportErrorDto[];
}
