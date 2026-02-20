import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportController } from './controllers/import.controller';
import { ImportService } from './services/import.service';
import { CsvParserService } from './services/csv-parser.service';
import { JsonParserService } from './services/json-parser.service';
import { ImportValidatorService } from './services/import-validator.service';
import { Question } from './entities/question.entity';
import { ImportSession } from './entities/import-session.entity';
import { ImportError as ImportErrorEntity } from './entities/import-error.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, ImportSession, ImportErrorEntity]),
  ],
  controllers: [ImportController],
  providers: [
    ImportService,
    CsvParserService,
    JsonParserService,
    ImportValidatorService,
  ],
  exports: [ImportService],
})
export class QuestionImportModule {}
