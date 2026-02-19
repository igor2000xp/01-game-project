import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    // Validate DTO
    if (!createCategoryDto.name || createCategoryDto.name.trim().length < 3) {
      throw new BadRequestException('Category name must be at least 3 characters');
    }

    // Create category entity
    const category = this.categoryRepository.create({
      name: createCategoryDto.name,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await this.categoryRepository.save(category);

    return this.toDto(category);
  }

  async findAll(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.find({
      select: ['id', 'name', 'created_at', 'updated_at'],
    });

    return categories.map(c => this.toDto(c));
  }

  async findOne(id: string): Promise<CategoryDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      select: ['id', 'name', 'created_at', 'updated_at'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.toDto(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

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

    await this.categoryRepository.save(category);

    return this.toDto(category);
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.categoryRepository.delete(id);
  }

  // Helper methods
  private toDto(category: Category): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }
}
