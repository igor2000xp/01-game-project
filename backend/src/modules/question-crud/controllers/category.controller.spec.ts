import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from '../services/category.service';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const mockCategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
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
    service = module.get<CategoryService>(CategoryService);

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
      expect(service.create).toHaveBeenCalledWith(createDto);
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
      expect(service.findAll).toHaveBeenCalled();
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
      expect(service.findOne).toHaveBeenCalledWith(categoryId);
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
      expect(service.update).toHaveBeenCalledWith(categoryId, updateDto);
    });
  });

  describe('DELETE /categories/:id', () => {
    it('should delete a category', async () => {
      const categoryId = 'cat-1';

      mockCategoryService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(categoryId);

      expect(result).toBeUndefined();
      expect(service.delete).toHaveBeenCalledWith(categoryId);
    });
  });
});
