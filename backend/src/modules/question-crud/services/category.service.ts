import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto, CategoryWithCountDto, CategoryListWithCountDto } from '../dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    // Validate DTO
    if (!createCategoryDto.name || createCategoryDto.name.trim().length < 3) {
      throw new BadRequestException('Category name must be at least 3 characters');
    }

    // Create category entity
    const category = await this.categoryRepository.create({
      name: createCategoryDto.name,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return this.toDto(category);
  }

  async findAll(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.findAll();

    return categories.map(c => this.toDto(c));
  }

  async findAllWithCounts(): Promise<CategoryListWithCountDto> {
    const categoriesWithCounts = await this.categoryRepository.findAllWithCounts();

    return {
      data: categoriesWithCounts.map(c => ({
        id: c.id,
        name: c.name,
        created_at: new Date(c.created_at),
        updated_at: new Date(c.updated_at),
        question_count: parseInt(String(c.question_count)),
      })),
      total: categoriesWithCounts.length,
    };
  }

  async findOne(id: string): Promise<CategoryDto> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.toDto(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDto> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (updateCategoryDto.name !== undefined) {
      if (updateCategoryDto.name.trim().length < 3) {
        throw new BadRequestException('Category name must be at least 3 characters');
      }
      category.name = updateCategoryDto.name;
    }

    category.updated_at = new Date();

    const saved = await this.categoryRepository.create(category);

    return this.toDto(saved);
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }

  // Helper methods
  private toDto(category: any): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }
}
