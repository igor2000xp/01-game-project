import { Controller, Post, Get, Param, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from '../services/import.service';
import { ImportSessionDto } from '../dto/import-session.dto';
import { ImportResultDto } from '../dto/import-result.dto';

@Controller('api/questions/import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async importFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('mode') mode?: 'skip' | 'replace',
  ): Promise<ImportResultDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.importService.importQuestions(file, mode || 'skip');
  }

  @Get('sessions/:id')
  async getSession(@Param('id') id: string): Promise<ImportSessionDto> {
    const session = await this.importService.getSession(id);
    const errors = await this.importService.getSessionErrors(id);

    return {
      id: session.id,
      fileName: session.file_name,
      fileType: session.file_type,
      status: session.status,
      totalRows: session.total_rows,
      successCount: session.success_count,
      errorCount: session.error_count,
      createdAt: session.created_at,
      errors: errors.map((e) => ({
        id: e.id,
        rowNumber: e.row_number,
        errorType: e.error_type,
        message: e.message,
      })),
    };
  }
}
