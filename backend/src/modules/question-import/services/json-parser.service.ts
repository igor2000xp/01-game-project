import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

export interface ParsedRecord {
  question_text: string;
  reference_answer: string;
  category?: string;
}

type JsonRecord = Record<string, unknown>;

@Injectable()
export class JsonParserService {
  async parseFile(fileStream: Readable): Promise<ParsedRecord[]> {
    return new Promise((resolve, reject) => {
      let data = '';

      fileStream
        .on('data', (chunk: Buffer | string) => {
          data += chunk.toString();
        })
        .on('end', () => {
          try {
            const records = JSON.parse(data) as unknown;
            if (!Array.isArray(records)) {
              reject(new Error('JSON must be an array'));
              return;
            }

            // Map JSON records to expected structure
            const mapped = (records as JsonRecord[]).map((record) => ({
              question_text:
                typeof record.question_text === 'string'
                  ? record.question_text
                  : typeof record.question === 'string'
                    ? record.question
                    : '',
              reference_answer:
                typeof record.reference_answer === 'string'
                  ? record.reference_answer
                  : typeof record.answer === 'string'
                    ? record.answer
                    : '',
              category:
                typeof record.category === 'string'
                  ? record.category
                  : undefined,
            }));

            resolve(mapped);
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Unknown error';
            reject(new Error(`Invalid JSON format: ${message}`));
          }
        })
        .on('error', reject);
    });
  }
}
