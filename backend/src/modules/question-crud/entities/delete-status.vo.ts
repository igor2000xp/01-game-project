import { IsEnum, IsOptional } from 'class-validator';

export enum DeleteStatus {
  SOFT_DELETED = 'soft_deleted',
  HARD_DELETED = 'hard_deleted',
}
