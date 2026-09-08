# Contribuir a AI Workflow Backend

Gracias por tu interés en contribuir a este proyecto.

## Configuración del entorno

```bash
npm install
cp .env.example .env
docker compose up -d
npm run dev
```

## Antes de abrir un PR

Corré todos los checks de calidad y asegurate de que pasen:

```bash
npm run build
npm test
npm run lint
```

## Convenciones del proyecto

- **Separación de capas**: rutas (`*.routes.ts`) nunca contienen lógica de negocio; esa va en el service (`*.service.ts`). El acceso a datos vive únicamente en el repository (`*.repository.ts`).
- **Tipado**: evitar `any`; los tipos de dominio van en `*.types.ts` dentro de cada módulo.
- **Proveedores de IA**: cualquier integración nueva de IA debe implementar la interfaz definida en `providers/ai/ai-provider.ts`, nunca acoplarse directamente a un SDK externo desde el service.
- **Tests**: todo endpoint nuevo necesita al menos un test en `test/` que cubra el caso feliz y un caso de error.

## Estilo de commits

Mensajes cortos y descriptivos en modo imperativo: `agrega endpoint de cancelación de workflow`, `corrige manejo de error en mock provider`.

## Reportar bugs o proponer features

Abrí un issue describiendo el comportamiento actual, el esperado, y pasos para reproducir si aplica.
