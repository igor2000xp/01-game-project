import { IsString, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CategoryDto {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export class CategoryWithCountDto {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  question_count: number;
}

export class CategoryListWithCountDto {
  data: CategoryWithCountDto[];
  total: number;
}

export class CreateCategoryDto {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  name: string;
}

export class UpdateCategoryDto {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(100, { message: 'Name must be at most 100 characters' })
  name?: string;
}
