import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from '../services/category.service';
import {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryListWithCountDto,
} from '../dto/category.dto';

describe('CategoryController', () => {
  let controller: CategoryController;

  const mockCategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllWithCounts: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /categories', () => {
    it('should create a category', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Geography',
      };

      const expected: CategoryDto = {
        id: 'cat-1',
        name: createDto.name,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockCategoryService.create.mockResolvedValue(expected);

      const result = await controller.create(createDto);

      expect(result).toEqual(expected);
      expect(mockCategoryService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('GET /categories', () => {
    it('should return all categories', async () => {
      const expected: CategoryDto[] = [
        {
          id: 'cat-1',
          name: 'Geography',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'cat-2',
          name: 'Math',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockCategoryService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();

      expect(result).toEqual(expected);
      expect(result).toHaveLength(2);
      expect(mockCategoryService.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /categories/with-counts', () => {
    it('should return categories with question counts', async () => {
      const expected: CategoryListWithCountDto = {
        data: [
          {
            id: 'cat-1',
            name: 'Geography',
            created_at: new Date(),
            updated_at: new Date(),
            question_count: 15,
          },
          {
            id: 'cat-2',
            name: 'Math',
            created_at: new Date(),
            updated_at: new Date(),
            question_count: 8,
          },
        ],
        total: 2,
      };

      mockCategoryService.findAllWithCounts.mockResolvedValue(expected);

      const result = await controller.findAllWithCounts();

      expect(result).toEqual(expected);
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.data[0].question_count).toBe(15);
      expect(mockCategoryService.findAllWithCounts).toHaveBeenCalled();
    });

    it('should handle empty category list', async () => {
      const expected: CategoryListWithCountDto = {
        data: [],
        total: 0,
      };

      mockCategoryService.findAllWithCounts.mockResolvedValue(expected);

      const result = await controller.findAllWithCounts();

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('GET /categories/:id', () => {
    it('should return a single category', async () => {
      const categoryId = 'cat-1';

      const expected: CategoryDto = {
        id: categoryId,
        name: 'Geography',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockCategoryService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(categoryId);

      expect(result).toEqual(expected);
      expect(mockCategoryService.findOne).toHaveBeenCalledWith(categoryId);
    });
  });

  describe('PUT /categories/:id', () => {
    it('should update a category', async () => {
      const categoryId = 'cat-1';

      const updateDto: UpdateCategoryDto = {
        name: 'World Geography',
      };

      const expected: CategoryDto = {
        id: categoryId,
        name: updateDto.name!,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockCategoryService.update.mockResolvedValue(expected);

      const result = await controller.update(categoryId, updateDto);

      expect(result).toEqual(expected);
      expect(mockCategoryService.update).toHaveBeenCalledWith(
        categoryId,
        updateDto,
      );
    });
  });

  describe('DELETE /categories/:id', () => {
    it('should delete a category', async () => {
      const categoryId = 'cat-1';

      mockCategoryService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(categoryId);

      expect(result).toBeUndefined();
      expect(mockCategoryService.delete).toHaveBeenCalledWith(categoryId);
    });
  });
});
