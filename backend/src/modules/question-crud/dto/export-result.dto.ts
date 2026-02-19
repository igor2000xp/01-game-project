import { IsEnum, IsString, IsDate } from 'class-validator';
import { ExportFormat } from './export-request.dto';

export class ExportResultDto {
  @IsEnum(ExportFormat)
  format: ExportFormat;

  @IsString()
  filename: string;

  @IsString()
  record_count: number;

  @IsDate()
  created_at: Date;

  @IsString()
  message?: string;
}
