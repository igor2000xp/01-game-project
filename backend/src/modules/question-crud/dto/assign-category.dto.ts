import { IsString, IsUUID, MinLength } from 'class-validator';

export class AssignCategoryDto {
  @IsString()
  @IsUUID()
  @MinLength(3, { message: 'Category ID must be valid UUID' })
  category_id: string;
}
