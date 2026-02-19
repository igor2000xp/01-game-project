import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum ExportFormat {
  CSV = 'csv',
  JSON = 'json',
}

export class ExportRequestDto {
  @IsEnum(ExportFormat)
  format: ExportFormat;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  include_deleted?: boolean;
}
