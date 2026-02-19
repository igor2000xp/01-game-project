export class QuestionDto {
  id: string;
  question_text: string;
  reference_answer: string;
  category_id: string | null;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}
