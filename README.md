# AI Workflow Backend

> Production-oriented backend infrastructure for AI workflows, automation, REST APIs, and blockchain-verified workflow execution.

[![CI](https://github.com/Nicolas-Pedernera/ai-workflow-backend/actions/workflows/test.yml/badge.svg)](https://github.com/Nicolas-Pedernera/ai-workflow-backend/actions/workflows/test.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-20%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.x-black.svg)](https://fastify.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-supported-blue.svg)](https://www.postgresql.org/)
[![EVM](https://img.shields.io/badge/EVM-compatible-purple.svg)](https://ethereum.org/)

---

## Overview

AI Workflow Backend is a modular TypeScript backend for creating, executing, persisting, and verifying AI-powered workflows.

The system combines:

- REST APIs
- workflow lifecycle management
- AI provider abstraction
- deterministic risk analysis
- PostgreSQL persistence
- EVM blockchain integration
- smart-contract workflow registration
- automated testing
- CI/CD
- local AI inference through Ollama
- OpenAI-compatible remote providers

The architecture is intentionally modular so that application logic, AI providers, persistence, and blockchain infrastructure remain separated.

---

## Architecture

```text
                         AI WORKFLOW BACKEND

                                Client
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   Fastify API   │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ WorkflowService │
                         └───────┬─────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
       ┌────────────┐     ┌────────────┐    ┌──────────────┐
       │ AI Provider│     │ PostgreSQL │    │  Blockchain  │
       │   Layer    │     │ Repository │    │   Service    │
       └─────┬──────┘     └────────────┘    └──────┬───────┘
             │                                      │
       ┌─────┼──────────┐                           ▼
       │     │          │                    WorkflowRegistry
       ▼     ▼          ▼                           │
     Mock  Ollama  OpenAI-compatible               ▼
                                                   EVM
