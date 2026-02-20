import { Injectable } from '@nestjs/common';
import { parse } from 'fast-csv';
import { Readable } from 'stream';

export interface ParsedRecord {
  question_text: string;
  reference_answer: string;
  category?: string;
}

type CsvRow = Record<string, unknown>;

@Injectable()
export class CsvParserService {
  async parseFile(fileStream: Readable): Promise<ParsedRecord[]> {
    return new Promise((resolve, reject) => {
      const records: ParsedRecord[] = [];

      fileStream
        .pipe(parse({ headers: true, trim: true }))
        .on('data', (row: CsvRow) => {
          const questionText =
            typeof row.question_text === 'string'
              ? row.question_text
              : typeof row.question === 'string'
                ? row.question
                : '';
          const referenceAnswer =
            typeof row.reference_answer === 'string'
              ? row.reference_answer
              : typeof row.answer === 'string'
                ? row.answer
                : '';
          const category =
            typeof row.category === 'string' ? row.category : undefined;
          // Map CSV columns to expected structure
          records.push({
            question_text: questionText,
            reference_answer: referenceAnswer,
            category,
          });
        })
        .on('end', () => resolve(records))
        .on('error', (error) => reject(error));
    });
  }
}
