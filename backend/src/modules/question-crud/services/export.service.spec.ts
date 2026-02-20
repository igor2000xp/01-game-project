import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ExportService } from '../services/export.service';
import { ExportRequestDto, ExportFormat } from '../dto/export-request.dto';
import { QuestionRepository } from '../repositories/question.repository';

describe('ExportService', () => {
  let service: ExportService;
  const mockQuestionRepo = {
    getQuestionsForExport: jest.fn(),
  };

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
      const questions = [
        {
          id: 'q1',
          question_text: 'What is the capital of France?',
          reference_answer: 'Paris',
          category_id: 'cat-1',
          created_at: new Date('2026-01-15T10:00:00.000Z'),
          updated_at: new Date('2026-01-15T10:00:00.000Z'),
        },
      ];

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
        {
          id: 'q1',
          question_text: 'Simple question',
          reference_answer: 'Simple answer',
          category_id: null,
          created_at: new Date('2026-01-15T10:00:00.000Z'),
          updated_at: new Date('2026-01-15T10:00:00.000Z'),
        },
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
          format: 'invalid' as any,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should include deleted questions when requested', async () => {
      const questions = [
        {
          id: 'q1',
          question_text: 'Deleted question',
          reference_answer: 'Deleted answer',
          category_id: null,
          created_at: new Date('2026-01-15T10:00:00.000Z'),
          updated_at: new Date('2026-01-15T10:00:00.000Z'),
          is_deleted: true,
        },
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
      const filename = service.generateFilename('csv');
      expect(filename).toMatch(/^questions_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.csv$/);
    });

    it('should generate JSON filename', () => {
      const filename = service.generateFilename('json');
      expect(filename).toMatch(/^questions_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.json$/);
    });
  });

  describe('generateCSV', () => {
    it('should generate valid CSV with BOM', () => {
      const questions = [
        {
          id: 'q1',
          question_text: 'Question',
          reference_answer: 'Answer',
          category_id: 'cat-1',
          created_at: new Date('2026-01-15T10:00:00.000Z'),
          updated_at: new Date('2026-01-15T10:00:00.000Z'),
        },
      ];

      const csv = service.generateCSV(questions);

      expect(csv).toContain('\uFEFF'); // BOM
      expect(csv).toContain('id,question_text,reference_answer,category_id,created_at,updated_at');
      expect(csv).toContain('"q1"');
      expect(csv).toContain('Question');
      expect(csv).toContain('Answer');
    });

    it('should escape commas in fields', () => {
      const questions = [
        {
          id: 'q1',
          question_text: 'Question with "quotes"',
          reference_answer: 'Answer with "quotes"',
          category_id: 'cat-1',
          created_at: new Date('2026-01-15T10:00:00.000Z'),
          updated_at: new Date('2026-01-15T10:00:00.000Z'),
        },
      ];

      const csv = service.generateCSV(questions);

      expect(csv).toContain('"Question with ""quotes""'); // Escaped quotes
    });
  });

  describe('generateJSON', () => {
    it('should generate valid JSON', () => {
      const questions = [
        {
          id: 'q1',
          question_text: 'Simple question',
          reference_answer: 'Simple answer',
          category_id: null,
          created_at: new Date('2026-01-15T10:00:00.000Z'),
          updated_at: new Date('2026-01-15T10:00:00.000Z'),
        },
      ];

      const json = service.generateJSON(questions);

      const parsed = JSON.parse(json);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].id).toBe('q1');
      expect(parsed[0].question_text).toBe('Simple question');
      expect(parsed[0].reference_answer).toBe('Simple answer');
    });
  });
});
