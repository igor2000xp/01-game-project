import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Question } from '../entities/question.entity';

export interface CategoryWithCount {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  question_count: number;
}

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
  ) {}

  async create(data: Partial<Category>): Promise<Category> {
    return this.categoryRepo.save(data);
  }

  async save(category: Category): Promise<Category> {
    return this.categoryRepo.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find();
  }

  async findAllWithCounts(): Promise<CategoryWithCount[]> {
    return this.categoryRepo
      .createQueryBuilder('category')
      .leftJoin(
        'category.questions',
        'question',
        'question.is_deleted = :isDeleted',
      )
      .setParameter('isDeleted', false)
      .select([
        'category.id',
        'category.name',
        'category.created_at',
        'category.updated_at',
        'COUNT(question.id) as question_count',
      ])
      .groupBy('category.id')
      .orderBy('category.name', 'ASC')
      .getRawMany();
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      select: ['id', 'name'],
    });

    return category || null;
  }

  async delete(id: string): Promise<void> {
    const category = await this.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.categoryRepo.delete(id);

    // Update questions to remove category_id reference
    const questions = await this.questionRepo.find({
      where: { category_id: id },
      select: [
        'id',
        'question_text',
        'reference_answer',
        'created_at',
        'updated_at',
        'is_deleted',
      ],
    });

    questions.forEach((q) => {
      q.category_id = null;
      q.updated_at = new Date();
    });

    await this.questionRepo.save(questions);
  }
}
