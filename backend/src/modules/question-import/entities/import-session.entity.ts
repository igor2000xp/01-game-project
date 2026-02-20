import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('import_sessions')
@Index(['created_at']) // For session queries
export class ImportSession {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  file_name: string;

  @Column({ type: 'varchar', length: 10 })
  file_type: string;

  @Column({ type: 'varchar', length: 20 })
  status: string; // PROGRESSING, COMPLETED, FAILED

  @Column({ type: 'integer', default: 0 })
  total_rows: number;

  @Column({ type: 'integer', default: 0 })
  success_count: number;

  @Column({ type: 'integer', default: 0 })
  error_count: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
