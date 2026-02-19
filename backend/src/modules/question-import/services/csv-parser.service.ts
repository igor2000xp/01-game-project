import { Injectable } from '@nestjs/common';
import { parse } from 'fast-csv';
import { Readable } from 'stream';

export interface ParsedRecord {
  question_text: string;
  reference_answer: string;
  category?: string;
}

@Injectable()
export class CsvParserService {
  async parseFile(fileStream: Readable): Promise<ParsedRecord[]> {
    return new Promise((resolve, reject) => {
      const records: ParsedRecord[] = [];

      fileStream
        .pipe(parse({ headers: true, trim: true }))
        .on('data', (row: any) => {
          // Map CSV columns to expected structure
          records.push({
            question_text: row.question_text || row.question || '',
            reference_answer: row.reference_answer || row.answer || '',
            category: row.category,
          });
        })
        .on('end', () => resolve(records))
        .on('error', (error) => reject(error));
    });
  }
}
