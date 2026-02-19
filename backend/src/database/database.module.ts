import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:', // Use in-memory SQLite for demo
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-sync schema (for demo only)
      logging: false,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
