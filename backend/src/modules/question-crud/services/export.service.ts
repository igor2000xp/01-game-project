import { Injectable, BadRequestException } from '@nestjs/common';
import { QuestionRepository } from '../repositories/question.repository';
import { Question } from '../entities/question.entity';
import { ExportRequestDto } from '../dto';

export interface ExportResultData {
  success: boolean;
  format: string;
  filename: string;
  record_count: number;
  message: string;
  content: string;
  contentType: string;
}

@Injectable()
export class ExportService {
  constructor(private questionRepo: QuestionRepository) {}

  async exportQuestions(request: ExportRequestDto): Promise<ExportResultData> {
    const { format, category_id, include_deleted = false } = request;

    // Validate format
    if (!['csv', 'json'].includes(format)) {
      throw new BadRequestException(`Invalid format: ${format}. Supported formats: csv, json`);
    }

    // Fetch questions
    const questions = await this.questionRepo.getQuestionsForExport({
      category_id,
      include_deleted,
    });

    // Generate content and content type based on format
    if (format === 'csv') {
      return {
        success: true,
        format,
        filename: this.generateFilename('csv'),
        record_count: questions.length,
        message: `Exported ${questions.length} questions`,
        content: this.generateCSV(questions),
        contentType: 'text/csv; charset=utf-8',
      };
    } else if (format === 'json') {
      return {
        success: true,
        format,
        filename: this.generateFilename('json'),
        record_count: questions.length,
        message: `Exported ${questions.length} questions`,
        content: this.generateJSON(questions),
        contentType: 'application/json; charset=utf-8',
      };
    } else {
      throw new BadRequestException(`Unsupported format: ${format}`);
    }
  }

  generateFilename(format: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const extension = format === 'csv' ? 'csv' : 'json';

    return `questions_${timestamp}.${extension}`;
  }

  generateCSV(questions: Question[]): string {
    // CSV Header
    const header = 'id,question_text,reference_answer,category_id,created_at,updated_at';

    // CSV Rows
    const rows = questions.map(q => {
      const category_id = q.category_id || '';
      const created_at = q.created_at.toISOString();
      const updated_at = q.updated_at.toISOString();

      // Escape fields with double quotes
      const id = `"${q.id}"`;
      const question_text = this.escapeCSVField(q.question_text || '');
      const reference_answer = this.escapeCSVField(q.reference_answer || '');
      const category_id_field = category_id ? `"${category_id}"` : '';
      const created_at_field = `"${created_at}"`;
      const updated_at_field = `"${updated_at}"`;

      return [id, question_text, reference_answer, category_id_field, created_at_field, updated_at_field].join(',');
    });

    // Combine with BOM for UTF-8
    const bom = '\uFEFF'; // UTF-8 BOM
    return bom + header + '\r\n' + rows.join('\r\n');
  }

  private escapeCSVField(value: string): string {
    if (!value) return '';
    // Escape double quotes by doubling them
    let escaped = value.replace(/"/g, '""');
    // Wrap in quotes
    return `"${escaped}"`;
  }

  generateJSON(questions: Question[]): string {
    return JSON.stringify(questions, null, 2);
  }
}
