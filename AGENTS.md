# AGENTS.md

Guía rápida para asistentes de IA (GitHub Copilot, Claude Code, etc.) que trabajen en este repositorio.

## Arquitectura

Este proyecto sigue **Clean Architecture organizada en vertical slices**, con un patrón CQRS ligero. Antes de tocar código, ubicá en qué capa estás:

- `src/modules/<module>/domain/` — lógica de negocio pura. **Nunca** importa `pg`, `viem`, Fastify ni ningún cliente externo.
- `src/modules/<module>/commands/<action>/` — una acción que muta estado. Cada carpeta tiene `*.handler.ts` (lógica de orquestación), `*.route.ts` (traduce HTTP ↔ bus) y, si aplica, `*.schema.ts` (validación de input).
- `src/modules/<module>/queries/<action>/` — una acción de lectura. Mismo patrón que commands, sin schema normalmente.
- `src/modules/<module>/database/` — puertos (interfaces, sufijo `.port.ts`) e implementaciones concretas (Postgres, etc.). El dominio depende del puerto, nunca de la implementación.
- `src/modules/<module>/index.ts` — único lugar donde se instancian dependencias concretas y se registran handlers/rutas. Acepta un objeto `overrides` opcional para poder inyectar mocks en tests.
- `src/shared/cqrs/` — el bus de comandos/queries. Las rutas HTTP nunca llaman directo a un handler de otro módulo: siempre pasan por `commandBus.execute(...)` o `queryBus.execute(...)`.
- `src/shared/exceptions/` — excepciones base (`NotFoundException`, `ValidationException`). Los errores de dominio de cada módulo extienden de acá y se traducen a HTTP en `src/shared/error-handler.ts`.

## Reglas al agregar una feature nueva

1. Si es una acción nueva (crear/mutar/leer algo), creá una carpeta nueva dentro de `commands/` o `queries/` del módulo correspondiente — no agregues métodos sueltos a un "service" gigante.
2. La lógica de negocio pura (cálculos, validaciones de dominio, transformaciones de entidades) va en `domain/`, no en el handler.
3. Nunca importes una implementación concreta de `database/` desde otro módulo — solo el puerto (`*.port.ts`).
4. Registrá el nuevo handler en el `index.ts` del módulo (bus + ruta), no en `app.ts` directamente.
5. Los tests de handlers no necesitan una base de datos real: usá un repositorio en memoria (ver `test/helpers/in-memory-workflow-repository.ts`) o mocks simples con `vi.fn()`.

## Comandos útiles

```bash
npm run dev          # levantar en modo watch
npm run build        # compilar TypeScript
npm test             # correr la suite de Vitest (requiere Postgres, ver docker-compose.yml)
npm run lint         # ESLint
npm run db:migrate   # correr migraciones SQL contra DATABASE_URL
```

## Convenciones de estilo

- TypeScript estricto, sin `any` salvo casos justificados (filas crudas de `pg`, ver comentarios `biome-ignore` en repositorios).
- Nombres de archivo en kebab-case, uno por responsabilidad (`create-workflow.handler.ts`, no `workflow.utils.ts`).
- Los errores de dominio siempre extienden `BaseException` y exponen `statusCode` + `code`.
