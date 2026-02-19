import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { QuestionImportModule } from './modules/question-import/question-import.module';
import { QuestionCrudModule } from './modules/question-crud/question-crud.module';

@Module({
  imports: [
    DatabaseModule,
    QuestionImportModule,
    QuestionCrudModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
