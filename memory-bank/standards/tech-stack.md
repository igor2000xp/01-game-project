# Tech Stack

## Overview

Full-stack TypeScript application for AI-Trainer demo using Nest.js backend, Angular frontend, and SQLite database with integrated LLM/SLM capabilities.

## Languages

**TypeScript**

Primary language for both backend and frontend development. Chosen for:
- Type safety - catches bugs early in development
- Excellent IDE support and tooling
- First-class support in both Nest.js and Angular frameworks
- Enables AI code generation with better context

## Framework

**Backend: Nest.js**

- Progressive Node.js framework for building efficient, scalable applications
- Uses TypeScript by default with full type safety
- Provides dependency injection, modular architecture, and excellent testing support
- Well-suited for API development and integration with external services

**Frontend: Angular**

- Full-featured web application framework
- TypeScript-first design with component-based architecture
- Built-in routing, forms, and HTTP client
- Excellent for building complex, maintainable applications

## Authentication

**TBD - To be defined**

Authentication is required for student tracking/sessions. Specific authentication method to be determined based on requirements:
- Possible options: JWT, session-based, or simplified demo auth
- Decision pending further specification of session requirements

## Infrastructure & Deployment

**Local Development Only**

- Application runs locally for demonstration purposes
- No cloud deployment planned
- Database: SQLite (file-based, no server required)
- Ollama runs locally for SLM inference
- GLM-5 Z.AI API requires internet connection but no local deployment

## Package Manager

**npm**

Default package manager for Node.js ecosystem. Chosen for:
- Widest compatibility across the ecosystem
- Standard tooling and documentation
- Familiar to most developers

## LLM Integration

**Chief Examiner (LLM): GLM-5 Z.AI API**

- Large Language Model for final audit phase
- Evaluates SLM performance from logged interactions
- API-based integration with secure key storage

**Assistant-Trainee (SLM): Ollama - gemma3:8b**

- Small Language Model for initial answer evaluation
- Runs locally via Ollama server
- Configurable provider switching (local vs API)
- Primary evaluator comparing user answers against reference answers

## Decision Relationships

- **TypeScript** → Enables consistent type safety across Nest.js and Angular
- **Nest.js** → Natural pairing with TypeScript, provides structured backend architecture
- **Angular** → TypeScript-first frontend framework, pairs well with Nest.js backend
- **Local Infrastructure** → Simplified deployment, SQLite for local data persistence
- **LLM Integration** → Dual-layer design with local SLM (Ollama) and cloud LLM (GLM-5 Z.AI API)
