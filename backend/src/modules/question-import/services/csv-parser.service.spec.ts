import { Test, TestingModule } from '@nestjs/testing';
import { CsvParserService } from './csv-parser.service';
import { Readable } from 'stream';

describe('CsvParserService', () => {
  let service: CsvParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvParserService],
    }).compile();

    service = module.get<CsvParserService>(CsvParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should parse CSV data correctly', async () => {
    const csvData =
      'question_text,reference_answer,category\nWhat is the capital of France?,Paris,Geography\nWhat is 2+2?,Four,Math';
    const stream = Readable.from(csvData);

    const result = await service.parseFile(stream);

    expect(result).toHaveLength(2);
    expect(result[0].question_text).toBe('What is the capital of France?');
    expect(result[0].reference_answer).toBe('Paris');
    expect(result[0].category).toBe('Geography');
  });

  it('should handle CSV with missing optional category', async () => {
    const csvData = 'question_text,reference_answer\nWhat is 2+2?,Four';
    const stream = Readable.from(csvData);

    const result = await service.parseFile(stream);

    expect(result).toHaveLength(1);
    expect(result[0].question_text).toBe('What is 2+2?');
    expect(result[0].reference_answer).toBe('Four');
    expect(result[0].category).toBeUndefined();
  });
});
