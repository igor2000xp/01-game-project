import { IsOptional, IsInt, Min, Max, IsUUID, IsString, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { QuestionDto } from './question.dto';
import { SortBy } from '../entities/sort-by.vo';

export class QuestionQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsEnum(SortBy)
  sort_by?: SortBy;
}

export interface PaginatedQuestionListDto {
  data: QuestionDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
