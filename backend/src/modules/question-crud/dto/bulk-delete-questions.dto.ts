import { IsArray, IsEnum, ArrayNotEmpty, MinLength } from 'class-validator';

export enum DeleteMode {
  ALL = 'all',
  BY_CATEGORY = 'by-category',
}

export class BulkDeleteQuestionsDto {
  @IsEnum(DeleteMode)
  mode: DeleteMode;

  @IsArray()
  @ArrayNotEmpty({ message: 'Must provide at least one question ID' })
  @MinLength(1, {
    each: true,
    message: 'Question IDs must be at least 1 character',
  })
  questionIds: string[];

  category_id?: string;
}
