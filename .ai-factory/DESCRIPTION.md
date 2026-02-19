# Project: AI-Trainer Demo

## Overview

Full-stack TypeScript application demonstrating an AI-powered training system. The system evaluates user answers against reference questions using a dual-layer AI architecture: a local Small Language Model (SLM) for initial evaluation and a cloud Large Language Model (LLM) for final audit.

## Core Features

- **Question Management**: Store question-answer pairs from podcast transcripts
- **Answer Evaluation**: Compare user answers against reference answers using SLM (Ollama gemma3:8b)
- **Session Tracking**: Log user sessions and evaluation results
- **Audit System**: Final audit by LLM (GLM-5 Z.AI API) reviewing SLM performance
- **Admin Dashboard**: View sessions, evaluations, and audit reports

## Tech Stack

### Languages
- **TypeScript** - Primary language for both backend and frontend

### Backend
- **Nest.js** - Progressive Node.js framework with TypeScript
- **TypeORM** - Object-Relational Mapper with decorator-based entities
- **SQLite** - File-based database for local demo
- **Winston** - Structured logging (JSON in production, text in development)

### Frontend
- **Angular** - Full-featured web application framework
- **RxJS** - Reactive programming for async operations
- **Angular Testing Library** - Component testing

### AI Integration
- **Chief Examiner (LLM)**: GLM-5 Z.AI API - Final audit phase
- **Assistant-Trainee (SLM)**: Ollama gemma3:8b - Initial answer evaluation

### Tools
- **npm** - Package manager
- **Prettier** - Code formatting (printWidth: 100, singleQuote: true)
- **ESLint** - Linting with strict TypeScript rules
- **Jest** - Testing framework (backend and frontend)
- **Playwright** - E2E testing for critical flows
- **Husky + lint-staged** - Pre-commit hooks

## Architecture Notes

### Backend Structure (Nest.js)
```
src/
  modules/
    question/      # Question entities and management
    evaluation/    # SLM evaluation logic
    audit/         # LLM audit logic
    auth/          # Authentication (TBD)
  common/
    decorators/    # Custom decorators
    filters/       # Exception filters
    interceptors/  # Logging, transformation
  config/          # Configuration management
  database/        # TypeORM configuration
```

### Frontend Structure (Angular)
```
src/
  app/
    features/
      question/    # Question display and submission
      evaluation/  # Evaluation results display
      audit/       # Audit report viewing
      auth/        # Authentication UI
    shared/        # Reusable components
    core/          # Singleton services, guards
```

### Database Schema
- **Questions** - Question text + reference answer
- **Sessions** - User session tracking
- **Evaluations** - SLM evaluation results with comments
- **AuditReports** - LLM audit results

## Non-Functional Requirements

- **Logging**: Structured JSON in production, text in development. Always log SLM/LLM requests, evaluations, audits. Never log API keys, passwords, or PII.
- **Error Handling**: Custom error classes (EvaluationError, LlmServiceError) with structured API error format
- **Type Safety**: TypeScript strict mode enabled, no `any` types
- **Testing**: 80% coverage target with unit, integration, and E2E tests
- **Deployment**: Local development only, no cloud deployment
- **Authentication**: TBD (JWT, session-based, or simplified demo auth)

## Environment Variables

Required for development:
- `DATABASE_URL` - SQLite database file path
- `ZAI_API_KEY` - GLM-5 Z.AI API key
- `OLLAMA_URL` - Ollama server URL (default: http://localhost:11434)

## Architecture

See `.ai-factory/ARCHITECTURE.md` for detailed architecture guidelines.

**Pattern**: Modular Monolith

**Key Principles**:
- Feature modules (question, evaluation, audit, auth) with explicit public APIs
- Modules communicate via dependency injection and events
- Shared module contains only truly cross-cutting concerns
- Module boundaries align with business domains, not technical concerns
