import { SortBy } from './sort-by.vo';

export class QuestionFilter {
  text?: string;
  category_id?: string;

  page: number = 1;
  limit: number = 20;

  sort_by: SortBy = SortBy.CREATED_AT;
}
