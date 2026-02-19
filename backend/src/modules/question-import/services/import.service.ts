import { Injectable, BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import { Question } from '../entities/question.entity';
import { ImportSession } from '../entities/import-session.entity';
import { ImportError as ImportErrorEntity } from '../entities/import-error.entity';
import { ImportStatus } from '../entities/import-status.vo';
import { ErrorType } from '../entities/error-type.vo';
import { CsvParserService } from './csv-parser.service';
import { JsonParserService } from './json-parser.service';
import { ImportValidatorService } from './import-validator.service';
import { ImportResultDto } from '../dto/import-result.dto';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const BATCH_SIZE = 100; // Per ADR-005

interface ParsedRecord {
  question_text: string;
  reference_answer: string;
  category?: string;
}

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(ImportSession)
    private sessionRepository: Repository<ImportSession>,
    @InjectRepository(ImportErrorEntity)
    private errorRepository: Repository<ImportErrorEntity>,
    private csvParser: CsvParserService,
    private jsonParser: JsonParserService,
    private validator: ImportValidatorService,
  ) {}

  async importQuestions(file: Express.Multer.File, mode: 'skip' | 'replace' = 'skip'): Promise<ImportResultDto> {
    // File size validation
    if (file.size > MAX_FILE_SIZE) {
      throw new PayloadTooLargeException('File exceeds maximum size of 10MB');
    }

    // Determine file type
    const fileType = file.originalname.endsWith('.csv') ? 'CSV' : 'JSON';

    // Create import session
    const session = this.sessionRepository.create({
      id: uuidv4(),
      file_name: file.originalname,
      file_type: fileType,
      status: ImportStatus.PROGRESSING,
      total_rows: 0,
      success_count: 0,
      error_count: 0,
    });
    await this.sessionRepository.save(session);

    try {
      // Parse file
      const fileStream = Readable.from(file.buffer);
      const records = fileType === 'CSV'
        ? await this.csvParser.parseFile(fileStream)
        : await this.jsonParser.parseFile(fileStream);

      // Update session with total rows
      session.total_rows = records.length;
      await this.sessionRepository.save(session);

      // Process records
      await this.processRecords(records, session, mode);

      // Mark session as completed
      session.status = ImportStatus.COMPLETED;
      await this.sessionRepository.save(session);

      // Return result
      return {
        sessionId: session.id,
        totalRows: session.total_rows,
        successCount: session.success_count,
        errorCount: session.error_count,
        errors: [],
      };
    } catch (error) {
      // Mark session as failed
      session.status = ImportStatus.FAILED;
      await this.sessionRepository.save(session);

      // Log critical error
      await this.errorRepository.save({
        id: uuidv4(),
        session_id: session.id,
        row_number: 0,
        error_type: ErrorType.UNKNOWN_ERROR,
        message: error.message,
      });

      throw new BadRequestException(`Import failed: ${error.message}`);
    }
  }

  private async processRecords(
    records: ParsedRecord[],
    session: ImportSession,
    mode: 'skip' | 'replace',
  ): Promise<void> {
    const validQuestions: Partial<Question>[] = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const rowNumber = i + 1;

      // Validate record
      const validation = this.validator.validateQuestionData(record, rowNumber);

      if (!validation.isValid) {
        // Log validation error
        await this.errorRepository.save({
          id: uuidv4(),
          session_id: session.id,
          row_number: rowNumber,
          error_type: this.validator.getErrorType(validation.errors[0]),
          message: validation.errors.join(', '),
        });

        session.error_count++;
        continue;
      }

      // Check for duplicates
      const existingQuestion = await this.questionRepository.findOne({
        where: {
          question_text: record.question_text,
          is_deleted: false,
        },
      });

      if (existingQuestion) {
        if (mode === 'skip') {
          // Log duplicate as error (warning)
          await this.errorRepository.save({
            id: uuidv4(),
            session_id: session.id,
            row_number: rowNumber,
            error_type: ErrorType.DUPLICATE_QUESTION,
            message: 'Question already exists',
          });

          session.error_count++;
          continue;
        }
        // If mode is 'replace', update existing question
        existingQuestion.reference_answer = record.reference_answer;
        existingQuestion.updated_at = new Date();
        await this.questionRepository.save(existingQuestion);
        session.success_count++;
        continue;
      }

      // Add to valid questions batch
      validQuestions.push({
        id: uuidv4(),
        question_text: record.question_text,
        reference_answer: record.reference_answer,
        category_id: null, // Categories not yet implemented
        is_deleted: false,
      });

      // Insert in batches
      if (validQuestions.length >= BATCH_SIZE) {
        await this.questionRepository.insert(validQuestions);
        session.success_count += validQuestions.length;
        await this.sessionRepository.save(session);
        validQuestions.length = 0;
      }
    }

    // Insert remaining records
    if (validQuestions.length > 0) {
      await this.questionRepository.insert(validQuestions);
      session.success_count += validQuestions.length;
      await this.sessionRepository.save(session);
    }
  }

  async getSession(sessionId: string): Promise<ImportSession> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new BadRequestException('Import session not found');
    }

    return session;
  }

  async getSessionErrors(sessionId: string): Promise<ImportErrorEntity[]> {
    return this.errorRepository.find({
      where: { session_id: sessionId },
      order: { row_number: 'ASC' },
    });
  }
}
