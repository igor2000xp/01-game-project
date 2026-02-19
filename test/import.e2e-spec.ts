import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Question Import (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/questions/import (POST)', () => {
    it('should reject request without file', () => {
      return request(app.getHttpServer())
        .post('/api/questions/import')
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('File is required');
        });
    });

    // Note: File upload tests would require multipart form data handling
    // For demo purposes, we're documenting the expected behavior
  });

  describe('/api/import/sessions/:id (GET)', () => {
    it('should return 400 for non-existent session', () => {
      return request(app.getHttpServer())
        .get('/api/import/sessions/non-existent-id')
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Import session not found');
        });
    });
  });
});
