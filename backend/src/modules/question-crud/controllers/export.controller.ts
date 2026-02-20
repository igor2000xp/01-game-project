import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from '../services/export.service';
import { ExportRequestDto } from '../dto/export-request.dto';

@Controller('questions/export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  /**
   * Export questions to specified format
   * POST /questions/export
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  async export(
    @Body() request: ExportRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.exportService.exportQuestions(request);

    if (!result.success) {
      throw new BadRequestException(result.message || 'Export failed');
    }

    // Set headers for file download
    res.setHeader('Content-Type', result.contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.filename}"`,
    );

    // Send the content
    res.send(result.content);
  }
}
