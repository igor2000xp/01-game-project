import { IsUUID, IsOptional } from 'class-validator';

export class DeleteCategoryDto {
  @IsOptional()
  @IsUUID()
  category_id?: string;
}
