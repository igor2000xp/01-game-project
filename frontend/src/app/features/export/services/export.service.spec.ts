import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { ExportService } from './export.service';

describe('ExportService', () => {
  let service: ExportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ExportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('posts export request and expects blob response', async () => {
    const resultPromise = firstValueFrom(service.exportQuestions({ format: 'csv' }));

    const req = httpMock.expectOne('/questions/export');
    expect(req.request.method).toBe('POST');
    expect(req.request.responseType).toBe('blob');
    const blob = new Blob(['csv,data'], { type: 'text/csv' });
    req.flush(blob);

    await expect(resultPromise).resolves.toEqual(blob);
  });

  it('downloads blob using object URL and temporary anchor', () => {
    const createObjectUrlSpy = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:mock');
    const revokeSpy = vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => {});
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    service.downloadFile(new Blob(['x']), 'file.csv');

    expect(createObjectUrlSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalledWith('blob:mock');
  });

  it('generates timestamped filenames with selected format', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-20T12:34:56.000Z'));
    const filename = service.generateFilename('json');
    vi.useRealTimers();

    expect(filename).toBe('questions-export-2026-02-20_12-34-56.json');
  });
});
