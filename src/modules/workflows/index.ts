import type { FastifyInstance } from "fastify";
import { AIProviderFactory } from "../../providers/ai/ai-provider.factory.js";
import { BlockchainService } from "../blockchain/client/blockchain.service.js";
import { commandBus, queryBus } from "../../shared/cqrs/bus.js";
import { createWorkflowHandler } from "./commands/create-workflow/create-workflow.handler.js";
import { registerCreateWorkflowRoute } from "./commands/create-workflow/create-workflow.route.js";
import { runWorkflowHandler } from "./commands/run-workflow/run-workflow.handler.js";
import { registerRunWorkflowRoute } from "./commands/run-workflow/run-workflow.route.js";
import { setWorkflowStatusHandler } from "./commands/set-workflow-status/set-workflow-status.handler.js";
import { registerSetWorkflowStatusRoute } from "./commands/set-workflow-status/set-workflow-status.route.js";
import { WorkflowRepository } from "./database/workflow.repository.js";
import { findRunByIdHandler } from "./queries/find-run-by-id/find-run-by-id.handler.js";
import { registerFindRunByIdRoute } from "./queries/find-run-by-id/find-run-by-id.route.js";
import { findWorkflowByIdHandler } from "./queries/find-workflow-by-id/find-workflow-by-id.handler.js";
import { registerFindWorkflowByIdRoute } from "./queries/find-workflow-by-id/find-workflow-by-id.route.js";
import { findWorkflowsHandler } from "./queries/find-workflows/find-workflows.handler.js";
import { registerFindWorkflowsRoute } from "./queries/find-workflows/find-workflows.route.js";
import { getBlockchainWorkflowHandler } from "./queries/get-blockchain-workflow/get-blockchain-workflow.handler.js";
import { registerGetBlockchainWorkflowRoute } from "./queries/get-blockchain-workflow/get-blockchain-workflow.route.js";
import type { WorkflowRepositoryPort } from "./database/workflow.repository.port.js";
import type { AIProvider } from "../../providers/ai/ai-provider.js";

export interface WorkflowsModuleOverrides {
  repository?: WorkflowRepositoryPort;
  blockchain?: BlockchainService;
  aiProvider?: AIProvider;
}

/**
 * Punto único de composición del módulo workflows.
 * Construye las dependencias concretas (o usa las que le pasen,
 * útil para tests), registra los handlers en el command/query bus
 * y monta las rutas HTTP.
 */
export function registerWorkflowsModule(
  app: FastifyInstance,
  overrides: WorkflowsModuleOverrides = {}
): void {
  const repository = overrides.repository ?? new WorkflowRepository();
  const blockchain = overrides.blockchain ?? new BlockchainService();
  const aiProvider = overrides.aiProvider ?? AIProviderFactory.create();

  commandBus.register("workflows.create", createWorkflowHandler({ repository, blockchain }));
  commandBus.register("workflows.run", runWorkflowHandler({ repository, aiProvider }));
  commandBus.register(
    "workflows.setStatus",
    setWorkflowStatusHandler({ repository, blockchain })
  );

  queryBus.register("workflows.findAll", findWorkflowsHandler(repository));
  queryBus.register("workflows.findById", findWorkflowByIdHandler(repository));
  queryBus.register("runs.findById", findRunByIdHandler(repository));
  queryBus.register(
    "workflows.getBlockchain",
    getBlockchainWorkflowHandler({ repository, blockchain })
  );

  registerCreateWorkflowRoute(app);
  registerRunWorkflowRoute(app);
  registerSetWorkflowStatusRoute(app);
  registerFindWorkflowsRoute(app);
  registerFindWorkflowByIdRoute(app);
  registerFindRunByIdRoute(app);
  registerGetBlockchainWorkflowRoute(app);
}
