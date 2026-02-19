import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from './category.service';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepo: Repository<Category>;

  const mockCategoryRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepo,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepo = module.get<Repository<Category>>(getRepositoryToken(Category));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Geography',
      };

      const mockCategory = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: createDto.name,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockCategoryRepo.create.mockReturnValue(mockCategory);
      mockCategoryRepo.save.mockResolvedValue(mockCategory);

      const result = await service.create(createDto);

      expect(result.id).toBe(mockCategory.id);
      expect(result.name).toBe(createDto.name);
      expect(mockCategoryRepo.create).toHaveBeenCalled();
      expect(mockCategoryRepo.save).toHaveBeenCalledWith(mockCategory);
    });

    it('should throw BadRequestException if name is too short', async () => {
      const createDto: CreateCategoryDto = {
        name: 'AB',
      };

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createDto)).rejects.toThrow('Category name must be at least 3 characters');
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const mockCategories = [
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

      mockCategoryRepo.find.mockResolvedValue(mockCategories);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Geography');
      expect(result[1].name).toBe('Math');
      expect(mockCategoryRepo.find).toHaveBeenCalledWith({
        select: ['id', 'name', 'created_at', 'updated_at'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      const mockCategory = {
        id: 'cat-1',
        name: 'Geography',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockCategoryRepo.findOne.mockResolvedValue(mockCategory);

      const result = await service.findOne('cat-1');

      expect(result.id).toBe('cat-1');
      expect(result.name).toBe('Geography');
      expect(mockCategoryRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'cat-1' },
        select: ['id', 'name', 'created_at', 'updated_at'],
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoryRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update category name', async () => {
      const mockCategory = {
        id: 'cat-1',
        name: 'Geography',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const updateDto: UpdateCategoryDto = {
        name: 'World Geography',
      };

      mockCategoryRepo.findOne.mockResolvedValue(mockCategory);
      mockCategoryRepo.save.mockResolvedValue({ ...mockCategory, name: 'World Geography' });

      const result = await service.update('cat-1', updateDto);

      expect(result.name).toBe('World Geography');
      expect(mockCategoryRepo.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if name is too short', async () => {
      const mockCategory = {
        id: 'cat-1',
        name: 'Geography',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const updateDto: UpdateCategoryDto = {
        name: 'AB',
      };

      mockCategoryRepo.findOne.mockResolvedValue(mockCategory);

      await expect(service.update('cat-1', updateDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if category not found', async () => {
      const updateDto: UpdateCategoryDto = {
        name: 'Updated Name',
      };

      mockCategoryRepo.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const mockCategory = {
        id: 'cat-1',
        name: 'Geography',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockCategoryRepo.findOne.mockResolvedValue(mockCategory);
      mockCategoryRepo.delete.mockResolvedValue({ affected: 1 });

      await expect(service.delete('cat-1')).resolves.not.toThrow();
      expect(mockCategoryRepo.delete).toHaveBeenCalledWith('cat-1');
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoryRepo.findOne.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});
