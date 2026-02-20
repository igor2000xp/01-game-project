export interface Question {
  id: string;
  text: string;
  answer: string;
  category_id?: string;
  type: 'multiple-choice' | 'open-ended' | 'true-false';
  options?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  question_count?: number;
  created_at: string;
  updated_at: string;
}

export interface QuestionFilter {
  page?: number;
  limit?: number;
  category_id?: string;
  search?: string;
  include_deleted?: boolean;
}

export interface QuestionListResponse {
  data: Question[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateQuestionDto {
  text: string;
  answer: string;
  category_id?: string;
  type: 'multiple-choice' | 'open-ended' | 'true-false';
  options?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface UpdateQuestionDto {
  text?: string;
  answer?: string;
  category_id?: string;
  type?: 'multiple-choice' | 'open-ended' | 'true-false';
  options?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name: string;
}
