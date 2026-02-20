import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { QuestionManagementPage } from './question-management.page';
import { QuestionService } from '../../services/question.service';
import { ImportService } from '../../../import/services/import.service';
import { ExportService } from '../../../export/services/export.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Category, Question } from '../../models/question.model';

describe('QuestionManagementPage (integration)', () => {
  let fixture: ComponentFixture<QuestionManagementPage>;
  let component: QuestionManagementPage;

  const questionServiceMock = {
    getQuestions: vi.fn(),
    getCategories: vi.fn(),
    createQuestion: vi.fn(),
    updateQuestion: vi.fn(),
    deleteQuestion: vi.fn(),
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
  };

  const importServiceMock = {
    uploadFile: vi.fn(),
    getImportStatus: vi.fn(),
  };

  const exportServiceMock = {
    exportQuestions: vi.fn(),
    generateFilename: vi.fn(),
    downloadFile: vi.fn(),
  };

  const notificationServiceMock = {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    questionServiceMock.getQuestions.mockReturnValue(
      of({ data: [makeQuestion()], total: 1, page: 1, limit: 20 })
    );
    questionServiceMock.getCategories.mockReturnValue(of([makeCategory()]));
    questionServiceMock.createQuestion.mockReturnValue(of({ id: 'q2' }));
    exportServiceMock.exportQuestions.mockReturnValue(of(new Blob(['data'])));
    exportServiceMock.generateFilename.mockReturnValue('questions-export.csv');

    await TestBed.configureTestingModule({
      imports: [QuestionManagementPage],
      providers: [
        { provide: QuestionService, useValue: questionServiceMock },
        { provide: ImportService, useValue: importServiceMock },
        { provide: ExportService, useValue: exportServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads questions and categories on init', () => {
    expect(questionServiceMock.getQuestions).toHaveBeenCalled();
    expect(questionServiceMock.getCategories).toHaveBeenCalledWith(true);
    expect(component.questions()).toHaveLength(1);
    expect(component.categories()).toHaveLength(1);
  });

  it('creates question and refreshes list on submit', () => {
    component.onQuestionSubmit({
      text: 'New question',
      answer: 'Answer',
      type: 'open-ended',
    });

    expect(questionServiceMock.createQuestion).toHaveBeenCalled();
    expect(notificationServiceMock.success).toHaveBeenCalledWith('Question created');
    expect(questionServiceMock.getQuestions).toHaveBeenCalledTimes(2);
  });

  it('shows error notification when loading questions fails', () => {
    questionServiceMock.getQuestions.mockReturnValueOnce(throwError(() => new Error('failure')));

    component.loadQuestions();

    expect(notificationServiceMock.error).toHaveBeenCalledWith('Failed to load questions');
  });

  it('exports questions and triggers file download', () => {
    component.onExport('csv');

    expect(notificationServiceMock.info).toHaveBeenCalledWith('Exporting to CSV...');
    expect(exportServiceMock.exportQuestions).toHaveBeenCalledWith(
      expect.objectContaining({ format: 'csv' })
    );
    expect(exportServiceMock.downloadFile).toHaveBeenCalledWith(
      expect.any(Blob),
      'questions-export.csv'
    );
  });
});
const makeQuestion = (overrides: Partial<Question> = {}): Question => ({
  id: 'q1',
  text: 'Q1',
  answer: 'A1',
  type: 'open-ended',
  category_id: 'cat-1',
  difficulty: 'easy',
  is_deleted: false,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

const makeCategory = (overrides: Partial<Category> = {}): Category => ({
  id: 'cat-1',
  name: 'Math',
  question_count: 1,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  ...overrides,
});
