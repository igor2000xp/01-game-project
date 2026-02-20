import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Category } from './entities/category.entity';
import { QuestionService } from './services/question.service';
import { CategoryService } from './services/category.service';
import { QuestionController } from './controllers/question.controller';
import { CategoryController } from './controllers/category.controller';
import { QuestionRepository } from './repositories/question.repository';
import { CategoryRepository } from './repositories/category.repository';
import { ExportController } from './controllers/export.controller';
import { ExportService } from './services/export.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Category])],
  controllers: [QuestionController, CategoryController, ExportController],
  providers: [
    QuestionService,
    CategoryService,
    QuestionRepository,
    CategoryRepository,
    ExportService,
  ],
  exports: [
    QuestionService,
    CategoryService,
    QuestionRepository,
    CategoryRepository,
  ],
})
export class QuestionCrudModule {}
