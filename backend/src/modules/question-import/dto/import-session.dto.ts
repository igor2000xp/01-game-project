export class ImportErrorDetailDto {
  id: string;
  rowNumber: number;
  errorType: string;
  message: string;
}

export class ImportSessionDto {
  id: string;
  fileName: string;
  fileType: string;
  status: string;
  totalRows: number;
  successCount: number;
  errorCount: number;
  createdAt: Date;
  errors: ImportErrorDetailDto[];
}
