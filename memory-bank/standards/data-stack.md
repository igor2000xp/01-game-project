# Data Stack

## Overview

SQLite database with TypeORM for the AI-Trainer demo application. Local file-based persistence optimized for demonstration purposes with minimal operational overhead.

## Database

**SQLite**

File-based relational database chosen for:
- Zero-configuration and serverless operation
- Ideal for local development and demo applications
- Sufficient capacity for demo data (questions, logs, audit reports)
- No infrastructure required - stores as single file on disk
- Excellent TypeScript support with TypeORM integration

**Database Schema** (based on requirements):

- **Questions Table** - Stores question-answer pairs from podcast transcripts
- **Sessions Table** - User session logs
- **Evaluations Table** - SLM evaluation results
- **AuditReports Table** - LLM audit results

**Structured Log Format**: [Question Text] + [Reference Answer] + [User Answer] + [SLM Evaluation + Comment]

## ORM / Database Client

**TypeORM**

Decorator-based Object-Relational Mapper for TypeScript. Chosen for:
- Excellent Nest.js ecosystem integration (TypeORM module)
- Decorator-based entity definitions match Angular/Nest.js patterns
- Automatic migrations and schema synchronization
- Full TypeScript type safety with entity classes
- Mature library with active community and documentation
- Built-in support for SQLite

**Key Features**:

- Entity decorators for clean schema definition
- Repository pattern for data access
- Query builder for complex queries
- Migration system for schema changes
- Connection pooling and transaction support

## Decision Relationships

- **SQLite** → Chosen for local demo, no infrastructure needed
- **TypeORM** → Excellent Nest.js integration, TypeScript-first design matches project stack
- **File-based storage** → Enables demo to run entirely locally with zero infrastructure setup
