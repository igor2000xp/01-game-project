import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
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
import { QuestionService } from '../services/question.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  /**
   * Create a new question
   * POST /questions
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createQuestionDto: CreateQuestionDto): Promise<QuestionDto> {
    return this.questionService.create(createQuestionDto);
  }

  /**
   * Get all questions with optional filtering and pagination
   * GET /questions?page=1&limit=20&text=search&category_id=xxx&sort_by=created_at
   */
  @Get()
  async findAll(@Query() queryDto: QuestionQueryDto): Promise<PaginatedQuestionListDto> {
    return this.questionService.findAll(queryDto);
  }

  /**
   * Get a specific question by ID
   * GET /questions/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<QuestionDto> {
    return this.questionService.findOne(id);
  }

  /**
   * Update a question by ID
   * PUT /questions/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionDto> {
    return this.questionService.update(id, updateQuestionDto);
  }

  /**
   * Soft delete a question by ID
   * DELETE /questions/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<SuccessDto> {
    return this.questionService.delete(id);
  }
}
