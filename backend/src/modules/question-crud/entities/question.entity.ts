import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Index } from 'typeorm';

@Entity('questions')
@Index(['question_text', 'category_id'])
export class Question {
  @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
  id: string;

  @Column({ type: 'text' })
  question_text: string;

  @Column({ type: 'text' })
  reference_answer: string;

  @Column({ type: 'uuid', nullable: true })
  category_id: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at: Date | null;

  @Column({ default: false })
  is_deleted: boolean;
}
