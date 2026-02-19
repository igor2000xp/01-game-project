import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

export interface ParsedRecord {
  question_text: string;
  reference_answer: string;
  category?: string;
}

@Injectable()
export class JsonParserService {
  async parseFile(fileStream: Readable): Promise<ParsedRecord[]> {
    return new Promise((resolve, reject) => {
      let data = '';

      fileStream
        .on('data', (chunk) => {
          data += chunk.toString();
        })
        .on('end', () => {
          try {
            const records: any[] = JSON.parse(data);
            if (!Array.isArray(records)) {
              reject(new Error('JSON must be an array'));
              return;
            }

            // Map JSON records to expected structure
            const mapped = records.map((record) => ({
              question_text: record.question_text || record.question || '',
              reference_answer: record.reference_answer || record.answer || '',
              category: record.category,
            }));

            resolve(mapped);
          } catch (error: any) {
            reject(new Error(`Invalid JSON format: ${error.message}`));
          }
        })
        .on('error', reject);
    });
  }
}
