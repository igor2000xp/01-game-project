import { Test, TestingModule } from '@nestjs/testing';
import { ExportController } from './export.controller';
import { ExportService } from '../services/export.service';
import { ExportFormat } from '../dto/export-request.dto';
import { BadRequestException } from '@nestjs/common';
import type { Response } from 'express';

describe('ExportController', () => {
  let controller: ExportController;
  let responseMock: { setHeader: jest.Mock; send: jest.Mock };
  const exportQuestionsMock = jest.fn();
  const generateFilenameMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportController],
      providers: [
        {
          provide: ExportService,
          useValue: {
            exportQuestions: exportQuestionsMock,
            generateFilename: generateFilenameMock,
          },
        },
      ],
    }).compile();

    controller = module.get<ExportController>(ExportController);
    responseMock = {
      setHeader: jest.fn(),
      send: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /questions/export', () => {
    it('should export questions to CSV format', async () => {
      const request = { format: ExportFormat.CSV };
      const csvResult = {
        success: true,
        format: 'csv',
        filename: 'questions_2026-02-19.csv',
        record_count: 2,
        message: 'Exported 2 questions',
        content: 'CSV content',
        contentType: 'text/csv; charset=utf-8',
      };

      exportQuestionsMock.mockResolvedValue(csvResult);

      await controller.export(request, responseMock as unknown as Response);

      expect(exportQuestionsMock).toHaveBeenCalledWith(request);
      expect(responseMock.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/csv; charset=utf-8',
      );
      expect(responseMock.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="questions_2026-02-19.csv"',
      );
      expect(responseMock.send).toHaveBeenCalledWith('CSV content');
    });

    it('should export questions to JSON format', async () => {
      const request = { format: ExportFormat.JSON };
      const jsonResult = {
        success: true,
        format: 'json',
        filename: 'questions_2026-02-19.json',
        record_count: 2,
        message: 'Exported 2 questions',
        content: 'JSON content',
        contentType: 'application/json; charset=utf-8',
      };

      exportQuestionsMock.mockResolvedValue(jsonResult);

      await controller.export(request, responseMock as unknown as Response);

      expect(exportQuestionsMock).toHaveBeenCalledWith(request);
      expect(responseMock.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/json; charset=utf-8',
      );
      expect(responseMock.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="questions_2026-02-19.json"',
      );
      expect(responseMock.send).toHaveBeenCalledWith('JSON content');
    });

    it('should throw BadRequestException for invalid format', async () => {
      const request = { format: 'xml' as unknown as ExportFormat };
      const errorResult = {
        success: false,
        format: 'xml',
        filename: 'questions_2026-02-19.xml',
        record_count: 0,
        message: 'Invalid format: xml. Supported formats: csv, json',
        content: '',
        contentType: 'text/xml',
      };

      exportQuestionsMock.mockResolvedValue(errorResult);

      await expect(
        controller.export(request, responseMock as unknown as Response),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
