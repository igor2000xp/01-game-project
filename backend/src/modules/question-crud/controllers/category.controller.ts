import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto, CategoryListWithCountDto } from '../dto/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Create a new category
   * POST /categories
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    return this.categoryService.create(createCategoryDto);
  }

  /**
   * Get all categories
   * GET /categories
   */
  @Get()
  async findAll(): Promise<CategoryDto[]> {
    return this.categoryService.findAll();
  }

  /**
   * Get all categories with question counts
   * GET /categories/with-counts
   */
  @Get('with-counts')
  async findAllWithCounts(): Promise<CategoryListWithCountDto> {
    return this.categoryService.findAllWithCounts();
  }

  /**
   * Get a specific category by ID
   * GET /categories/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CategoryDto> {
    return this.categoryService.findOne(id);
  }

  /**
   * Update a category by ID
   * PUT /categories/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  /**
   * Delete a category by ID
   * DELETE /categories/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.categoryService.delete(id);
  }
}
