import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('questions')
@Index(['question_text']) // For duplicate detection
export class Question {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'text' })
  question_text: string;

  @Column({ type: 'text' })
  reference_answer: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  category_id: string | null;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  is_deleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
