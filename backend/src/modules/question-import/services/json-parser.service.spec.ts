import { Test, TestingModule } from '@nestjs/testing';
import { JsonParserService } from './json-parser.service';
import { Readable } from 'stream';

describe('JsonParserService', () => {
  let service: JsonParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonParserService],
    }).compile();

    service = module.get<JsonParserService>(JsonParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should parse valid JSON array correctly', async () => {
    const jsonData = JSON.stringify([
      { question_text: 'What is the capital of France?', reference_answer: 'Paris', category: 'Geography' },
      { question_text: 'What is 2+2?', reference_answer: 'Four', category: 'Math' },
    ]);
    const stream = Readable.from(jsonData);

    const result = await service.parseFile(stream);

    expect(result).toHaveLength(2);
    expect(result[0].question_text).toBe('What is the capital of France?');
    expect(result[0].reference_answer).toBe('Paris');
    expect(result[0].category).toBe('Geography');
  });

  it('should throw error for non-array JSON', async () => {
    const jsonData = JSON.stringify({ question_text: 'test', reference_answer: 'answer' });
    const stream = Readable.from(jsonData);

    await expect(service.parseFile(stream)).rejects.toThrow('JSON must be an array');
  });

  it('should throw error for invalid JSON', async () => {
    const jsonData = '{ invalid json }';
    const stream = Readable.from(jsonData);

    await expect(service.parseFile(stream)).rejects.toThrow();
  });

  it('should handle JSON without category field', async () => {
    const jsonData = JSON.stringify([
      { question_text: 'What is 2+2?', reference_answer: 'Four' },
    ]);
    const stream = Readable.from(jsonData);

    const result = await service.parseFile(stream);

    expect(result).toHaveLength(1);
    expect(result[0].category).toBeUndefined();
  });
});
