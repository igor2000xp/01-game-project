import { IsString, IsOptional, IsUUID, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @MinLength(10, { message: 'question_text must be at least 10 characters' })
  question_text: string;

  @IsString()
  @MinLength(10, { message: 'reference_answer must be at least 10 characters' })
  reference_answer: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;
}
