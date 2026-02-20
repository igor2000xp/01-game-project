export class ImportFileDto {
  file: Express.Multer.File;
  mode?: 'skip' | 'replace';
}
