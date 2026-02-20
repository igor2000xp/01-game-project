import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('import_errors')
@Index(['session_id']) // For error queries
export class ImportError {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 36 })
  session_id: string;

  @Column({ type: 'integer' })
  row_number: number;

  @Column({ type: 'varchar', length: 50 })
  error_type: string;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
