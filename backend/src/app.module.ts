import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { QuestionImportModule } from './modules/question-import/question-import.module';

@Module({
  imports: [
    DatabaseModule,
    QuestionImportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
