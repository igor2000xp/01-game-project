import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from '../services/question.service';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  QuestionDto,
  PaginatedQuestionListDto,
} from '../dto';

describe('QuestionController', () => {
  let controller: QuestionController;
  let service: QuestionService;

  const mockQuestionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    removeCategory: jest.fn(),
    bulkDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        {
          provide: QuestionService,
          useValue: mockQuestionService,
        },
      ],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
    service = module.get<QuestionService>(QuestionService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /questions', () => {
    it('should create a question and return 201', async () => {
      const createDto: CreateQuestionDto = {
        question_text: 'What is the capital of France?',
        reference_answer: 'Paris',
      };

      const expectedDto: QuestionDto = {
        id: 'q1',
        question_text: createDto.question_text,
        reference_answer: createDto.reference_answer,
        category_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
      };

      mockQuestionService.create.mockResolvedValue(expectedDto);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('GET /questions', () => {
    it('should return paginated questions', async () => {
      const query = { page: 1, limit: 20 };

      const expected: PaginatedQuestionListDto = {
        data: [
          {
            id: 'q1',
            question_text: 'Question 1',
            reference_answer: 'Answer 1',
            category_id: null,
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      };

      mockQuestionService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(result).toEqual(expected);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });

    it('should pass query parameters including filters', async () => {
      const query = {
        page: 1,
        limit: 10,
        text: 'search',
        category_id: 'cat-1',
        sort_by: 'created_at' as const,
      };

      const expected: PaginatedQuestionListDto = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockQuestionService.findAll.mockResolvedValue(expected);

      await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('GET /questions/:id', () => {
    it('should return a single question', async () => {
      const questionId = 'q1';

      const expected: QuestionDto = {
        id: questionId,
        question_text: 'Question 1',
        reference_answer: 'Answer 1',
        category_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
      };

      mockQuestionService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(questionId);

      expect(result).toEqual(expected);
      expect(service.findOne).toHaveBeenCalledWith(questionId);
    });
  });

  describe('PUT /questions/:id', () => {
    it('should update a question', async () => {
      const questionId = 'q1';

      const updateDto: UpdateQuestionDto = {
        question_text: 'Updated question text',
      };

      const expected: QuestionDto = {
        id: questionId,
        question_text: updateDto.question_text!,
        reference_answer: 'Answer 1',
        category_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
      };

      mockQuestionService.update.mockResolvedValue(expected);

      const result = await controller.update(questionId, updateDto);

      expect(result).toEqual(expected);
      expect(service.update).toHaveBeenCalledWith(questionId, updateDto);
    });
  });

  describe('DELETE /questions/:id', () => {
    it('should delete a question', async () => {
      const questionId = 'q1';

      const expected = {
        success: true,
        message: 'Question deleted successfully',
      };

      mockQuestionService.delete.mockResolvedValue(expected);

      const result = await controller.delete(questionId);

      expect(result).toEqual(expected);
      expect(service.delete).toHaveBeenCalledWith(questionId);
    });
  });
});
