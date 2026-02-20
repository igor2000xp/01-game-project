import { Component, input, output, signal, computed, effect } from '@angular/core';
import {
  Question,
  Category,
  CreateQuestionDto,
  UpdateQuestionDto,
} from '../../models/question.model';

type QuestionType = 'multiple-choice' | 'open-ended' | 'true-false';
type Difficulty = 'easy' | 'medium' | 'hard';

interface FormData {
  text: string;
  answer: string;
  category_id: string;
  type: QuestionType;
  options: string[];
  difficulty: Difficulty;
}

@Component({
  selector: 'app-question-form',
  standalone: true,
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.css',
})
export class QuestionFormComponent {
  question = input<Question | undefined>();
  categories = input<Category[]>([]);

  submit = output<CreateQuestionDto | UpdateQuestionDto>();
  cancel = output<void>();

  readonly isEditMode = computed(() => !!this.question());

  readonly formData = signal<FormData>({
    text: '',
    answer: '',
    category_id: '',
    type: 'open-ended',
    options: [],
    difficulty: 'medium',
  });

  readonly availableTypes: QuestionType[] = ['open-ended', 'multiple-choice', 'true-false'];
  readonly availableDifficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  readonly isMultipleChoice = computed(
    () => this.formData().type === 'multiple-choice'
  );

  constructor() {
    effect(() => {
      const q = this.question();
      if (q) {
        this.formData.set({
          text: q.text,
          answer: q.answer,
          category_id: q.category_id || '',
          type: q.type as QuestionType,
          options: q.options || [],
          difficulty: (q.difficulty || 'medium') as Difficulty,
        });
      } else {
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.formData.set({
      text: '',
      answer: '',
      category_id: '',
      type: 'open-ended',
      options: [],
      difficulty: 'medium',
    });
  }

  onTextInput(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.formData.update((f) => ({ ...f, text: input.value }));
  }

  onAnswerInput(event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.formData.update((f) => ({ ...f, answer: input.value }));
  }

  onTypeSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.formData.update((f) => ({ ...f, type: select.value as QuestionType }));
  }

  onDifficultySelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.formData.update((f) => ({ ...f, difficulty: select.value as Difficulty }));
  }

  onCategorySelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.formData.update((f) => ({ ...f, category_id: select.value }));
  }

  onOptionInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const options = [...this.formData().options];
    options[index] = input.value;
    this.formData.update((f) => ({ ...f, options }));
  }

  addOption(): void {
    this.formData.update((f) => ({ ...f, options: [...f.options, ''] }));
  }

  removeOption(index: number): void {
    const options = this.formData().options.filter((_, i) => i !== index);
    this.formData.update((f) => ({ ...f, options }));
  }

  onSubmit(): void {
    const data = this.formData();

    // Validate required fields
    if (!data.text.trim() || !data.answer.trim()) {
      return;
    }

    const dto = this.isEditMode()
      ? ({ ...data, category_id: data.category_id || undefined } as UpdateQuestionDto)
      : ({ ...data, category_id: data.category_id || undefined } as CreateQuestionDto);

    this.submit.emit(dto);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  isFormValid(): boolean {
    const data = this.formData();
    if (!data.text.trim() || !data.answer.trim()) {
      return false;
    }

    if (data.type === 'multiple-choice') {
      const validOptions = data.options.filter((o) => o.trim().length > 0);
      return validOptions.length >= 2;
    }

    return true;
  }
}
