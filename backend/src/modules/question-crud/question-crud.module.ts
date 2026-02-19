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

@Module({
  imports: [TypeOrmModule.forFeature([Question, Category])],
  controllers: [QuestionController, CategoryController],
  providers: [
    QuestionService,
    CategoryService,
    QuestionRepository,
    CategoryRepository,
  ],
  exports: [QuestionService, CategoryService, QuestionRepository, CategoryRepository],
})
export class QuestionCrudModule {}
