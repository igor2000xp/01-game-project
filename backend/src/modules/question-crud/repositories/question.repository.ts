import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  In,
  Like,
  FindOptionsWhere,
  FindOptionsOrder,
} from 'typeorm';
import { Question } from '../entities/question.entity';
import { Category } from '../entities/category.entity';
import {
  QuestionQueryDto,
  PaginatedQuestionListDto,
  QuestionDto,
  SuccessDto,
  DeleteMode,
  BulkDeleteResultDto,
} from '../dto';
import { SortBy } from '../entities/sort-by.vo';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(data: Partial<Question>): Promise<Question> {
    return this.questionRepo.save(data);
  }

  async findAll(options: QuestionQueryDto): Promise<PaginatedQuestionListDto> {
    const { page = 1, limit = 20, text, category_id, sort_by } = options;

    const where: FindOptionsWhere<Question> = { is_deleted: false };

    if (text) {
      where.question_text = Like(`%${text}%`);
    }

    if (category_id) {
      where.category_id = category_id;
    }

    const orderBy = sort_by ?? SortBy.CREATED_AT;
    const skip = (page - 1) * limit;

    const order: FindOptionsOrder<Question> = {
      [orderBy]: 'ASC',
    } as FindOptionsOrder<Question>;
    const [questions, total] = await this.questionRepo.findAndCount({
      where,
      select: [
        'id',
        'question_text',
        'reference_answer',
        'category_id',
        'created_at',
        'updated_at',
        'is_deleted',
      ],
      order,
      skip,
      take: limit,
    });

    return {
      data: questions.map((q) => this.toDto(q)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<QuestionDto | null> {
    const question = await this.questionRepo.findOne({
      where: { id, is_deleted: false },
    });

    return question ? this.toDto(question) : null;
  }

  async update(
    id: string,
    data: Partial<Question>,
  ): Promise<QuestionDto | null> {
    const question = await this.questionRepo.findOne({
      where: { id, is_deleted: false },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    const updates: Partial<Question> = {};
    if (data.question_text) {
      updates.question_text = data.question_text;
    }
    if (data.reference_answer) {
      updates.reference_answer = data.reference_answer;
    }
    if (data.category_id) {
      const category = await this.categoryRepo.findOne({
        where: { id: data.category_id },
        select: ['id', 'name'],
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${data.category_id} not found`,
        );
      }

      updates.category_id = category.id;
    }

    question.updated_at = new Date();
    Object.assign(question, updates);

    await this.questionRepo.save(question);

    return this.toDto(question);
  }

  async softDelete(id: string): Promise<SuccessDto> {
    const question = await this.questionRepo.findOne({
      where: { id, is_deleted: false },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    question.is_deleted = true;
    question.deleted_at = new Date();

    await this.questionRepo.save(question);

    return { success: true, message: 'Question deleted successfully' };
  }

  async existsByText(text: string): Promise<boolean> {
    const result = await this.questionRepo.findOne({
      where: {
        question_text: text,
        is_deleted: false,
      },
    });

    return !!result;
  }

  async existsByCategory(categoryId?: string): Promise<boolean> {
    if (!categoryId) {
      return true;
    }

    const result = await this.questionRepo.findOne({
      where: {
        category_id: categoryId,
        is_deleted: false,
      },
    });

    return !!result;
  }

  async count(): Promise<number> {
    return await this.questionRepo.count({ where: { is_deleted: false } });
  }

  async getQuestionsForExport(options: {
    category_id?: string;
    include_deleted?: boolean;
  }): Promise<Question[]> {
    const where: FindOptionsWhere<Question> = {};
    if (options.category_id) {
      where.category_id = options.category_id;
    }
    if (options.include_deleted !== true) {
      where.is_deleted = false;
    }

    return this.questionRepo.find({
      where,
      select: [
        'id',
        'question_text',
        'reference_answer',
        'category_id',
        'created_at',
        'updated_at',
      ],
      order: { created_at: 'ASC' },
    });
  }

  async bulkSoftDelete(
    ids: string[],
    mode: DeleteMode,
  ): Promise<BulkDeleteResultDto> {
    return await this.questionRepo.manager.transaction(
      async (transactionalEntityManager) => {
        // Find all questions
        const questions = await transactionalEntityManager.find(Question, {
          where: {
            id: In(ids),
            is_deleted: false,
          },
          select: ['id', 'question_text', 'reference_answer', 'category_id'],
        });

        const idsToDelete = questions.map((q) => q.id);

        // Soft delete based on mode
        if (mode === DeleteMode.ALL) {
          questions.forEach((q) => {
            q.is_deleted = true;
            q.deleted_at = new Date();
          });
        } else if (mode === DeleteMode.BY_CATEGORY) {
          questions.forEach((q) => {
            q.is_deleted = true;
            q.deleted_at = new Date();
            q.category_id = null;
          });
        }

        await transactionalEntityManager.save(questions);

        return {
          deletedCount: idsToDelete.length,
          success: true,
          message: `${idsToDelete.length} questions deleted successfully`,
        };
      },
    );
  }

  private toDto(question: Question): QuestionDto {
    return {
      id: question.id,
      question_text: question.question_text,
      reference_answer: question.reference_answer,
      category_id: question.category_id,
      created_at: question.created_at,
      updated_at: question.updated_at,
      is_deleted: question.is_deleted,
    };
  }
}
