<p align="center">
  <img src=".github/assets/banner.svg" alt="AI Workflow Backend banner" width="100%" />
</p>

<p align="center">
  <a href="https://github.com/Nicolas-Pedernera/ai-workflow-backend/actions/workflows/test.yml">
    <img src="https://github.com/Nicolas-Pedernera/ai-workflow-backend/actions/workflows/test.yml/badge.svg" alt="CI status" />
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white" alt="Node >=18" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Fastify-black?logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/tests-vitest-6E9F18?logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" />
</p>

# AI Workflow Backend

Backend orientado a producción para orquestación de workflows de IA: creación, ejecución, persistencia y abstracción de proveedores de IA, expuesto vía una API REST.

## Tabla de contenidos

- [Overview](#overview)
- [Arquitectura](#arquitectura)
- [Features principales](#features-principales)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Ciclo de vida de un workflow](#ciclo-de-vida-de-un-workflow)
- [Abstracción de proveedores de IA](#abstracción-de-proveedores-de-ia)
- [API](#api)
- [Stack tecnológico](#stack-tecnológico)
- [Desarrollo local](#desarrollo-local)
- [Checks de calidad](#checks-de-calidad)
- [Principios de ingeniería](#principios-de-ingeniería)
- [Roadmap](#roadmap)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Autor](#autor)

## Overview

Backend en TypeScript diseñado en torno a la creación, ejecución, persistencia y abstracción de proveedores de IA para workflows. La arquitectura prioriza separación de responsabilidades, estado persistente de la aplicación, testeabilidad y extensibilidad para futuros proveedores de IA y estrategias de ejecución.

Desarrollado activamente como parte de mi portfolio de ingeniería, demostrando arquitectura backend práctica con Node.js, Fastify, PostgreSQL, TypeScript y testing automatizado.

## Arquitectura

<p align="center">
  <img src=".github/assets/architecture-diagram.svg" alt="Diagrama de arquitectura: REST API -> Workflow Routes -> Workflow Service -> Repository/AI Provider -> PostgreSQL/AI Provider(s)" width="100%" />
</p>

El backend sigue un enfoque de **Clean Architecture organizado en vertical slices**, inspirado en patrones de CQRS:

- **`domain/`** — lógica de negocio pura, sin dependencias de infraestructura (fácil de testear sin mocks pesados).
- **`commands/` y `queries/`** — cada acción del sistema (crear workflow, ejecutar workflow, listar workflows, etc.) vive en su propia carpeta con handler, ruta HTTP y, cuando aplica, validación de input.
- **`database/`** — puertos (interfaces) + implementaciones concretas (Postgres). El dominio nunca importa `pg` directamente.
- **Command/Query Bus** (`src/shared/cqrs/`) — desacopla las rutas HTTP de los handlers que resuelven cada acción.
- **`index.ts`** de cada módulo — punto único de composición (wiring de dependencias + registro de rutas).

Esto permite testear la lógica de negocio sin base de datos real (repositorios en memoria en los tests) y mantener cada feature autocontenida y fácil de ubicar.

## Features principales

| Área | Detalle |
|---|---|
| API | REST API construida con Fastify |
| Tipado | Codebase 100% TypeScript |
| Arquitectura | Clean Architecture por vertical slices + Command/Query Bus |
| Workflows | Creación, recuperación y ciclo de ejecución |
| Persistencia | PostgreSQL con patrón Repository (puerto + adaptador) |
| Riesgo | Motor de análisis de riesgo de liquidación (lógica de dominio pura) |
| Blockchain | Registro on-chain de workflows vía smart contract (viem) |
| IA | Abstracción de proveedores + mock provider para dev/testing |
| Testing | Tests automatizados de API y handlers con Vitest |
| Calidad | Linting con ESLint |
| Build | Build de producción en TypeScript |
| Infra | Entorno de desarrollo con Docker Compose + CI con Postgres real |

## Estructura del proyecto

```
src/
├── app.ts
├── server.ts
├── config/
│   ├── database.ts
│   └── blockchain.ts
├── shared/
│   ├── cqrs/                       # Command/Query bus compartido
│   └── exceptions/                 # Excepciones de dominio base
├── modules/
│   ├── workflows/
│   │   ├── commands/               # create-workflow, run-workflow, set-workflow-status
│   │   ├── queries/                # find-workflows, find-workflow-by-id, find-run-by-id...
│   │   ├── domain/                 # tipos, errores y lógica pura
│   │   ├── database/               # puerto + repositorio Postgres
│   │   └── index.ts                # composición del módulo
│   ├── health/
│   │   ├── queries/get-readiness/
│   │   ├── domain/
│   │   └── database/
│   ├── blockchain/
│   │   ├── client/                 # adaptador viem/RPC al smart contract
│   │   └── domain/                 # errores de dominio
│   └── risk/
│       └── domain/                 # motor de análisis de riesgo (lógica pura)
└── providers/
    └── ai/
        ├── ai-provider.factory.ts
        ├── ai-provider.ts
        └── mock-ai-provider.ts

test/
├── app.test.ts
├── workflows.test.ts
├── create-workflow.handler.test.ts
├── risk-analyzer.test.ts
├── blockchain-integration.test.ts
├── ai-provider-factory.test.ts
└── helpers/
    └── in-memory-workflow-repository.ts
```

## Ciclo de vida de un workflow

```
Create Workflow → Persist Workflow → Execute Workflow → Create Run → Track Execution State
```

## Abstracción de proveedores de IA

Las integraciones de IA están aisladas detrás de una interfaz de proveedor explícita. Esto evita acoplar el motor de workflows a un vendor específico de IA y permite reemplazar o extender proveedores de forma independiente.

## API

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/health` | Health check del servicio |
| `GET` | `/api/v1/status` | Estado general de la API |
| `POST` | `/api/v1/workflows` | Crea un nuevo workflow |
| `GET` | `/api/v1/workflows` | Lista todos los workflows |
| `GET` | `/api/v1/workflows/:id` | Obtiene un workflow por id |
| `POST` | `/api/v1/workflows/:id/run` | Ejecuta un workflow |
| `GET` | `/api/v1/runs/:id` | Consulta el estado de una ejecución |

<details>
<summary>Ejemplo: crear y ejecutar un workflow (curl)</summary>

```bash
# Crear un workflow
curl -X POST http://localhost:3000/api/v1/workflows \
  -H "Content-Type: application/json" \
  -d '{"name": "example-workflow"}'

# Ejecutarlo
curl -X POST http://localhost:3000/api/v1/workflows/<id>/run

# Consultar la ejecución
curl http://localhost:3000/api/v1/runs/<runId>
```

</details>

## Stack tecnológico

- Node.js
- TypeScript
- Fastify
- PostgreSQL / `pg`
- Vitest
- ESLint
- Docker Compose

## Desarrollo local

```bash
npm install
cp .env.example .env
docker compose up -d
npm run dev
```

## Checks de calidad

```bash
npm run build
npm test
npm run lint
```

Requiere una instancia de PostgreSQL disponible (ver `docker compose up -d` y variables de entorno en `.env.example`). El pipeline de CI levanta Postgres automáticamente en cada push/PR.

## Principios de ingeniería

- Vertical slices: cada feature (command/query) es autocontenida
- Dominio puro, sin dependencias de infraestructura
- Command/Query Bus para desacoplar HTTP de la lógica de negocio
- Tipado fuerte de punta a punta
- Persistencia basada en puertos (interfaces) + adaptadores
- Abstracción de proveedores de IA
- Excepciones de dominio tipadas, traducidas a HTTP en un único lugar
- Lógica de negocio testeable sin base de datos real (repositorios en memoria en tests)

## Roadmap

- [ ] Ejecución asíncrona de workflows
- [ ] Procesamiento de jobs en background
- [ ] Cache con Redis
- [ ] Ejecución de workflows basada en eventos
- [ ] Proveedores de IA adicionales
- [ ] Procesamiento de webhooks
- [ ] Autenticación y autorización
- [ ] Observabilidad y métricas
- [ ] Rate limiting
- [ ] Ejecución distribuida
- [ ] Automatización de despliegue a producción

## Contribuir

Las contribuciones son bienvenidas. Ver [CONTRIBUTING.md](CONTRIBUTING.md) para la guía de estilo, cómo correr los checks de calidad antes de un PR, y las convenciones del proyecto.

## Licencia

Distribuido bajo licencia MIT. Ver [LICENSE](LICENSE).

## Autor

**Nicolás Pedernera**

Systems Engineer — Universidad de Buenos Aires, 2024

Enfocado en backend engineering, fintech, criptomonedas, infraestructura blockchain y sistemas de IA.

- GitHub: [Nicolas-Pedernera](https://github.com/Nicolas-Pedernera)
- LinkedIn: [nicolas-pedernera-zendx](https://www.linkedin.com/in/nicolas-pedernera-zendx/)
- Upwork: [perfil de freelancer](https://www.upwork.com/freelancers/~017eec2171ae9d8805)
