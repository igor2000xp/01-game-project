import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionService } from './question.service';
import { Question } from '../entities/question.entity';
import { Category } from '../entities/category.entity';
import { CreateQuestionDto, UpdateQuestionDto } from '../dto';

describe('QuestionService', () => {
  let service: QuestionService;
  let questionRepo: Repository<Question>;
  let categoryRepo: Repository<Category>;

  const mockQuestionRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    update: jest.fn(),
  };

  const mockCategoryRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: getRepositoryToken(Question),
          useValue: mockQuestionRepo,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepo,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    questionRepo = module.get<Repository<Question>>(getRepositoryToken(Question));
    categoryRepo = module.get<Repository<Category>>(getRepositoryToken(Category));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a question without category', async () => {
      const createDto: CreateQuestionDto = {
        question_text: 'What is the capital of France?',
        reference_answer: 'The capital of France is Paris',
      };

      const mockQuestion = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        question_text: createDto.question_text,
        reference_answer: createDto.reference_answer,
        category_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
      };

      mockQuestionRepo.create.mockReturnValue(mockQuestion);
      mockQuestionRepo.save.mockResolvedValue(mockQuestion);

      const result = await service.create(createDto);

      expect(result.id).toBe(mockQuestion.id);
      expect(result.question_text).toBe(createDto.question_text);
      expect(result.reference_answer).toBe(createDto.reference_answer);
      expect(result.category_id).toBeNull();
      expect(mockQuestionRepo.create).toHaveBeenCalled();
      expect(mockQuestionRepo.save).toHaveBeenCalledWith(mockQuestion);
    });

    it('should create a question with category', async () => {
      const createDto: CreateQuestionDto = {
        question_text: 'What is 2+2?',
        reference_answer: 'The sum of 2 and 2 is four',
        category_id: 'cat-123',
      };

      const mockCategory = {
        id: 'cat-123',
        name: 'Math',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockQuestion = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        question_text: createDto.question_text,
        reference_answer: createDto.reference_answer,
        category_id: mockCategory.id,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
      };

      mockCategoryRepo.findOne.mockResolvedValue(mockCategory);
      mockQuestionRepo.create.mockReturnValue(mockQuestion);
      mockQuestionRepo.save.mockResolvedValue(mockQuestion);

      const result = await service.create(createDto);

      expect(result.category_id).toBe(mockCategory.id);
      expect(mockCategoryRepo.findOne).toHaveBeenCalledWith({
        where: { id: createDto.category_id },
        select: ['id', 'name'],
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      const createDto: CreateQuestionDto = {
        question_text: 'What is 2+2?',
        reference_answer: 'The sum of 2 and 2 is four',
        category_id: 'non-existent-cat',
      };

      mockCategoryRepo.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if question_text is too short', async () => {
      const createDto: CreateQuestionDto = {
        question_text: 'Short',
        reference_answer: 'Valid answer with enough characters',
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createDto)).rejects.toThrow('Question text must be at least 10 characters');
    });

    it('should throw BadRequestException if reference_answer is too short', async () => {
      const createDto: CreateQuestionDto = {
        question_text: 'Valid question text with enough characters',
        reference_answer: 'Short',
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createDto)).rejects.toThrow('Reference answer must be at least 10 characters');
    });
  });

  describe('findAll', () => {
    it('should return paginated questions', async () => {
      const mockQuestions = [
        {
          id: 'q1',
          question_text: 'Question 1',
          reference_answer: 'Answer 1',
          category_id: null,
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false,
        },
        {
          id: 'q2',
          question_text: 'Question 2',
          reference_answer: 'Answer 2',
          category_id: 'cat-1',
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false,
        },
      ];

      mockQuestionRepo.findAndCount.mockResolvedValue([mockQuestions, 2]);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(1);
    });

    it('should apply text filter', async () => {
      mockQuestionRepo.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ text: 'search' });

      expect(mockQuestionRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            question_text: expect.objectContaining({
              _type: 'like',
              _value: '%search%',
            }),
          }),
        }),
      );
    });

    it('should apply category filter', async () => {
      mockQuestionRepo.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ category_id: 'cat-1' });

      expect(mockQuestionRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category_id: 'cat-1',
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a question', async () => {
      const mockQuestion = {
        id: 'q1',
        question_text: 'Question 1',
        reference_answer: 'Answer 1',
        category_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
      };

      mockQuestionRepo.findOne.mockResolvedValue(mockQuestion);

      const result = await service.findOne('q1');

      expect(result.id).toBe('q1');
      expect(mockQuestionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'q1', is_deleted: false },
      });
    });

    it('should throw NotFoundException if question not found', async () => {
      mockQuestionRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update question text', async () => {
      const mockQuestion = {
        id: 'q1',
        question_text: 'Old text',
        reference_answer: 'Answer 1',
        category_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
      };

      const updateDto: UpdateQuestionDto = {
        question_text: 'Updated text',
      };

      mockQuestionRepo.findOne.mockResolvedValue(mockQuestion);
      mockQuestionRepo.save.mockResolvedValue({ ...mockQuestion, question_text: 'Updated text' });

      const result = await service.update('q1', updateDto);

      expect(result.question_text).toBe('Updated text');
      expect(mockQuestionRepo.save).toHaveBeenCalled();
    });

    it('should update category', async () => {
      const mockQuestion = {
        id: 'q1',
        question_text: 'Question',
        reference_answer: 'Answer',
        category_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
      };

      const mockCategory = {
        id: 'cat-1',
        name: 'Math',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const updateDto: UpdateQuestionDto = {
        category_id: 'cat-1',
      };

      mockQuestionRepo.findOne.mockResolvedValue(mockQuestion);
      mockCategoryRepo.findOne.mockResolvedValue(mockCategory);
      mockQuestionRepo.save.mockResolvedValue({ ...mockQuestion, category_id: 'cat-1' });

      const result = await service.update('q1', updateDto);

      expect(result.category_id).toBe('cat-1');
    });

    it('should throw BadRequestException for short text', async () => {
      const mockQuestion = {
        id: 'q1',
        question_text: 'Old text',
        reference_answer: 'Answer 1',
        category_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
      };

      const updateDto: UpdateQuestionDto = {
        question_text: 'Short',
      };

      mockQuestionRepo.findOne.mockResolvedValue(mockQuestion);

      await expect(service.update('q1', updateDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should soft delete a question', async () => {
      const mockQuestion = {
        id: 'q1',
        question_text: 'Question',
        reference_answer: 'Answer',
        category_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        is_deleted: false,
        deleted_at: null,
      };

      mockQuestionRepo.findOne.mockResolvedValue(mockQuestion);
      mockQuestionRepo.save.mockResolvedValue({ ...mockQuestion, is_deleted: true, deleted_at: expect.any(Date) });

      const result = await service.delete('q1');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Question deleted successfully');
    });

    it('should throw NotFoundException if question not found', async () => {
      mockQuestionRepo.findOne.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
