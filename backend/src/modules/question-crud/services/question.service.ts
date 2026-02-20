import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Like,
  In,
  FindOptionsWhere,
  FindOptionsOrder,
} from 'typeorm';
import { Question } from '../entities/question.entity';
import { Category } from '../entities/category.entity';
import {
  CreateQuestionDto,
  UpdateQuestionDto,
  QuestionQueryDto,
  QuestionDto,
  PaginatedQuestionListDto,
  SuccessDto,
  BulkDeleteQuestionsDto,
  BulkDeleteResultDto,
} from '../dto';
import { DeleteMode } from '../dto/bulk-delete-questions.dto';
import { SortBy } from '../entities/sort-by.vo';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<QuestionDto> {
    // Validate DTO
    if (
      !createQuestionDto.question_text ||
      createQuestionDto.question_text.trim().length < 10
    ) {
      throw new BadRequestException(
        'Question text must be at least 10 characters',
      );
    }
    if (
      !createQuestionDto.reference_answer ||
      createQuestionDto.reference_answer.trim().length < 10
    ) {
      throw new BadRequestException(
        'Reference answer must be at least 10 characters',
      );
    }

    // Create question entity
    const question = this.questionRepository.create({
      question_text: createQuestionDto.question_text,
      reference_answer: createQuestionDto.reference_answer,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Set category if provided
    if (createQuestionDto.category_id) {
      const category = await this.categoryRepository.findOne({
        where: { id: createQuestionDto.category_id },
        select: ['id', 'name'],
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${createQuestionDto.category_id} not found`,
        );
      }
      question.category_id = category.id;
    }

    await this.questionRepository.save(question);

    return this.toDto(question);
  }

  async findAll(queryDto: QuestionQueryDto): Promise<PaginatedQuestionListDto> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 20;
    const offset = (page - 1) * limit;
    const orderBy = queryDto.sort_by ?? SortBy.CREATED_AT;

    const where: FindOptionsWhere<Question> = { is_deleted: false };

    if (queryDto.text) {
      where.question_text = Like(`%${queryDto.text}%`);
    }

    if (queryDto.category_id) {
      where.category_id = queryDto.category_id;
    }

    const order: FindOptionsOrder<Question> = {
      [orderBy]: 'ASC',
    } as FindOptionsOrder<Question>;
    const [questions, total] = await this.questionRepository.findAndCount({
      where,
      select: [
        'id',
        'question_text',
        'reference_answer',
        'created_at',
        'updated_at',
        'category_id',
        'is_deleted',
      ],
      order,
      skip: offset,
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

  async findOne(id: string): Promise<QuestionDto> {
    const question = await this.questionRepository.findOne({
      where: { id, is_deleted: false },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return this.toDto(question);
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionDto> {
    const question = await this.questionRepository.findOne({
      where: { id, is_deleted: false },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    const updates: Partial<Question> = {};

    if (updateQuestionDto.question_text !== undefined) {
      if (updateQuestionDto.question_text.trim().length < 10) {
        throw new BadRequestException(
          'Question text must be at least 10 characters',
        );
      }
      updates.question_text = updateQuestionDto.question_text;
    }

    if (updateQuestionDto.reference_answer !== undefined) {
      if (updateQuestionDto.reference_answer.trim().length < 10) {
        throw new BadRequestException(
          'Reference answer must be at least 10 characters',
        );
      }
      updates.reference_answer = updateQuestionDto.reference_answer;
    }

    if (updateQuestionDto.category_id !== undefined) {
      if (updateQuestionDto.category_id) {
        const category = await this.categoryRepository.findOne({
          where: { id: updateQuestionDto.category_id },
          select: ['id', 'name'],
        });

        if (!category) {
          throw new NotFoundException(
            `Category with ID ${updateQuestionDto.category_id} not found`,
          );
        }

        updates.category_id = category.id;
      } else {
        updates.category_id = null;
      }
    }

    question.updated_at = new Date();
    Object.assign(question, updates);

    await this.questionRepository.save(question);

    return this.toDto(question);
  }

  async delete(id: string): Promise<SuccessDto> {
    const question = await this.questionRepository.findOne({
      where: { id, is_deleted: false },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Soft delete - set is_deleted flag
    question.is_deleted = true;
    question.deleted_at = new Date();

    await this.questionRepository.save(question);

    return { success: true, message: 'Question deleted successfully' };
  }

  async removeCategory(id: string): Promise<SuccessDto> {
    const question = await this.questionRepository.findOne({
      where: { id, is_deleted: false },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Soft delete - update is_deleted flag
    question.is_deleted = true;
    question.category_id = null;
    question.updated_at = new Date();

    await this.questionRepository.save(question);

    return {
      success: true,
      message: 'Category removed from question successfully',
    };
  }

  async bulkDelete(
    bulkDeleteDto: BulkDeleteQuestionsDto,
  ): Promise<BulkDeleteResultDto> {
    const { questionIds, category_id, mode } = bulkDeleteDto;

    // Build where clause
    const where: FindOptionsWhere<Question> = {
      id: In(questionIds),
      is_deleted: false,
    };

    if (mode === DeleteMode.BY_CATEGORY && category_id) {
      where.category_id = category_id;
    }

    // Verify questions exist
    const questions = await this.questionRepository.find({
      where,
      select: ['id'],
    });

    if (questions.length === 0) {
      throw new NotFoundException('No questions found matching criteria');
    }

    const idsToDelete = questions.map((q) => q.id);

    // Soft delete in transaction
    await this.questionRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.softDelete(Question, {
          where: {
            id: In(idsToDelete),
          },
        });
      },
    );

    return {
      deletedCount: idsToDelete.length,
      success: true,
      message: `${idsToDelete.length} questions deleted successfully`,
    };
  }

  // Helper methods
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
