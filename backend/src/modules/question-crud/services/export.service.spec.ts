import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ExportService } from '../services/export.service';
import { ExportFormat } from '../dto/export-request.dto';
import { QuestionRepository } from '../repositories/question.repository';
import { Question } from '../entities/question.entity';

describe('ExportService', () => {
  let service: ExportService;
  type ExportQuery = { category_id?: string; include_deleted?: boolean };
  const mockQuestionRepo = {
    getQuestionsForExport: jest.fn<Promise<Question[]>, [ExportQuery]>(),
  };

  const buildQuestion = (overrides: Partial<Question> = {}): Question => ({
    id: 'q1',
    question_text: 'What is the capital of France?',
    reference_answer: 'Paris',
    category_id: null,
    created_at: new Date('2026-01-15T10:00:00.000Z'),
    updated_at: new Date('2026-01-15T10:00:00.000Z'),
    deleted_at: null,
    is_deleted: false,
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExportService,
        {
          provide: QuestionRepository,
          useValue: mockQuestionRepo,
        },
      ],
    }).compile();

    service = module.get<ExportService>(ExportService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exportQuestions', () => {
    it('should export questions to CSV format', async () => {
      const questions = [buildQuestion({ category_id: 'cat-1' })];

      mockQuestionRepo.getQuestionsForExport.mockResolvedValue(questions);

      const result = await service.exportQuestions({
        format: ExportFormat.CSV,
        category_id: 'cat-1',
      });

      expect(result.success).toBe(true);
      expect(result.format).toBe('csv');
      expect(mockQuestionRepo.getQuestionsForExport).toHaveBeenCalledWith({
        category_id: 'cat-1',
        include_deleted: false,
      });
    });

    it('should export questions to JSON format', async () => {
      const questions = [
        buildQuestion({
          question_text: 'Simple question',
          reference_answer: 'Simple answer',
        }),
      ];

      mockQuestionRepo.getQuestionsForExport.mockResolvedValue(questions);

      const result = await service.exportQuestions({
        format: ExportFormat.JSON,
        include_deleted: true,
      });

      expect(result.success).toBe(true);
      expect(result.format).toBe('json');
      expect(mockQuestionRepo.getQuestionsForExport).toHaveBeenCalledWith({
        include_deleted: true,
      });
    });

    it('should throw error for invalid format', async () => {
      mockQuestionRepo.getQuestionsForExport.mockResolvedValue([]);

      await expect(
        service.exportQuestions({
          format: 'invalid' as ExportFormat,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should include deleted questions when requested', async () => {
      const questions = [
        buildQuestion({
          question_text: 'Deleted question',
          reference_answer: 'Deleted answer',
          is_deleted: true,
        }),
      ];

      mockQuestionRepo.getQuestionsForExport.mockResolvedValue(questions);

      const result = await service.exportQuestions({
        format: ExportFormat.CSV,
        include_deleted: true,
      });

      expect(result.record_count).toBe(1);
      expect(result.message).toContain('Exported 1 questions');
      expect(mockQuestionRepo.getQuestionsForExport).toHaveBeenCalledWith({
        include_deleted: true,
      });
    });
  });

  describe('generateFilename', () => {
    it('should generate CSV filename', () => {
      const filename = service.generateFilename(ExportFormat.CSV);
      expect(filename).toMatch(
        /^questions_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.csv$/,
      );
    });

    it('should generate JSON filename', () => {
      const filename = service.generateFilename(ExportFormat.JSON);
      expect(filename).toMatch(
        /^questions_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.json$/,
      );
    });
  });

  describe('generateCSV', () => {
    it('should generate valid CSV with BOM', () => {
      const questions = [
        buildQuestion({
          question_text: 'Question',
          reference_answer: 'Answer',
          category_id: 'cat-1',
        }),
      ];

      const csv = service.generateCSV(questions);

      expect(csv).toContain('\uFEFF'); // BOM
      expect(csv).toContain(
        'id,question_text,reference_answer,category_id,created_at,updated_at',
      );
      expect(csv).toContain('"q1"');
      expect(csv).toContain('Question');
      expect(csv).toContain('Answer');
    });

    it('should escape commas in fields', () => {
      const questions = [
        buildQuestion({
          question_text: 'Question with "quotes"',
          reference_answer: 'Answer with "quotes"',
          category_id: 'cat-1',
        }),
      ];

      const csv = service.generateCSV(questions);

      expect(csv).toContain('"Question with ""quotes""'); // Escaped quotes
    });
  });

  describe('generateJSON', () => {
    it('should generate valid JSON', () => {
      const questions = [
        buildQuestion({
          question_text: 'Simple question',
          reference_answer: 'Simple answer',
        }),
      ];

      const json = service.generateJSON(questions);

      const parsed = JSON.parse(json) as Question[];
      expect(parsed).toHaveLength(1);
      expect(parsed[0].id).toBe('q1');
      expect(parsed[0].question_text).toBe('Simple question');
      expect(parsed[0].reference_answer).toBe('Simple answer');
    });
  });
});
