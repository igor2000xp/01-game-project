import { Test, TestingModule } from '@nestjs/testing';
import { ImportValidatorService } from './import-validator.service';

describe('ImportValidatorService', () => {
  let service: ImportValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImportValidatorService],
    }).compile();

    service = module.get<ImportValidatorService>(ImportValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateQuestionData', () => {
    it('should pass validation with valid data', () => {
      const data = {
        question_text: 'What is the capital of France?',
        reference_answer: 'Paris is the capital of France.',
      };
      const result = service.validateQuestionData(data, 1);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when question_text is missing', () => {
      const data = {
        reference_answer: 'Paris',
      };
      const result = service.validateQuestionData(data, 1);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Column 'question_text' is required");
    });

    it('should fail when question_text is too short', () => {
      const data = {
        question_text: 'Short',
        reference_answer: 'Paris',
      };
      const result = service.validateQuestionData(data, 1);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Column 'question_text' must be at least 10 characters",
      );
    });

    it('should fail when reference_answer is missing', () => {
      const data = {
        question_text: 'What is the capital of France?',
      };
      const result = service.validateQuestionData(data, 1);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Column 'reference_answer' is required");
    });

    it('should fail when reference_answer is too short', () => {
      const data = {
        question_text: 'What is the capital of France?',
        reference_answer: 'Short',
      };
      const result = service.validateQuestionData(data, 1);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Column 'reference_answer' must be at least 10 characters",
      );
    });

    it('should pass when category is valid', () => {
      const data = {
        question_text: 'What is the capital of France?',
        reference_answer: 'Paris is the capital of France.',
        category: 'Geography',
      };
      const result = service.validateQuestionData(data, 1);

      expect(result.isValid).toBe(true);
    });

    it('should fail when category is too short', () => {
      const data = {
        question_text: 'What is the capital of France?',
        reference_answer: 'Paris',
        category: 'Ab',
      };
      const result = service.validateQuestionData(data, 1);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Column 'category' must be at least 3 characters",
      );
    });
  });

  describe('getErrorType', () => {
    it('should return MISSING_FIELD for required field errors', () => {
      const result = service.getErrorType("Column 'question_text' is required");
      expect(result).toBe('MISSING_FIELD');
    });

    it('should return INVALID_FORMAT for type errors', () => {
      const result = service.getErrorType(
        "Column 'question_text' must be a string",
      );
      expect(result).toBe('INVALID_FORMAT');
    });

    it('should return UNKNOWN_ERROR for other errors', () => {
      const result = service.getErrorType('Some other error');
      expect(result).toBe('UNKNOWN_ERROR');
    });
  });
});
