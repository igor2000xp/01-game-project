import { Injectable } from '@nestjs/common';
import { ErrorType } from '../entities/error-type.vo';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface ImportRecord {
  question_text?: unknown;
  reference_answer?: unknown;
  category?: unknown;
}

@Injectable()
export class ImportValidatorService {
  validateQuestionData(data: ImportRecord): ValidationResult {
    const errors: string[] = [];

    // Check required fields
    const questionText = data.question_text;
    if (
      questionText === undefined ||
      questionText === null ||
      questionText === ''
    ) {
      errors.push("Column 'question_text' is required");
    } else if (typeof questionText !== 'string') {
      errors.push("Column 'question_text' must be a string");
    } else if (questionText.trim().length < 10) {
      errors.push("Column 'question_text' must be at least 10 characters");
    }

    const referenceAnswer = data.reference_answer;
    if (
      referenceAnswer === undefined ||
      referenceAnswer === null ||
      referenceAnswer === ''
    ) {
      errors.push("Column 'reference_answer' is required");
    } else if (typeof referenceAnswer !== 'string') {
      errors.push("Column 'reference_answer' must be a string");
    } else if (referenceAnswer.trim().length < 10) {
      errors.push("Column 'reference_answer' must be at least 10 characters");
    }

    // Check optional category field
    const category = data.category;
    if (category && typeof category !== 'string') {
      errors.push("Column 'category' must be a string if provided");
    } else if (typeof category === 'string' && category.trim().length < 3) {
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
    if (
      errorMessage.includes('must be a string') ||
      errorMessage.includes('Invalid JSON')
    ) {
      return ErrorType.INVALID_FORMAT;
    }
    return ErrorType.UNKNOWN_ERROR;
  }
}
