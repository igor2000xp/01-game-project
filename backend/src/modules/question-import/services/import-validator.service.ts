import { Injectable } from '@nestjs/common';
import { ErrorType } from '../entities/error-type.vo';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

@Injectable()
export class ImportValidatorService {
  validateQuestionData(data: any, rowNumber: number): ValidationResult {
    const errors: string[] = [];

    // Check required fields
    if (!data.question_text) {
      errors.push("Column 'question_text' is required");
    } else if (typeof data.question_text !== 'string') {
      errors.push("Column 'question_text' must be a string");
    } else if (data.question_text.trim().length < 10) {
      errors.push("Column 'question_text' must be at least 10 characters");
    }

    if (!data.reference_answer) {
      errors.push("Column 'reference_answer' is required");
    } else if (typeof data.reference_answer !== 'string') {
      errors.push("Column 'reference_answer' must be a string");
    } else if (data.reference_answer.trim().length < 10) {
      errors.push("Column 'reference_answer' must be at least 10 characters");
    }

    // Check optional category field
    if (data.category && typeof data.category !== 'string') {
      errors.push("Column 'category' must be a string if provided");
    } else if (data.category && data.category.trim().length < 3) {
      errors.push("Column 'category' must be at least 3 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  getErrorType(errorMessage: string): ErrorType {
    if (errorMessage.includes('required')) {
      return ErrorType.MISSING_FIELD;
    }
    if (errorMessage.includes('must be a string') || errorMessage.includes('Invalid JSON')) {
      return ErrorType.INVALID_FORMAT;
    }
    return ErrorType.UNKNOWN_ERROR;
  }
}
