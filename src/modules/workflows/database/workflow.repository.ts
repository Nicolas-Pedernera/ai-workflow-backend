import type { Pool } from "pg";
import { db } from "../../../config/database.js";
import type { Workflow, WorkflowRun } from "../domain/workflow.types.js";
import type { WorkflowRepositoryPort } from "./workflow.repository.port.js";

export class WorkflowRepository implements WorkflowRepositoryPort {
  private readonly database: Pool;

  constructor(database: Pool = db) {
    this.database = database;
  }

  async saveWorkflow(workflow: Workflow): Promise<Workflow> {
    await this.database.query(
      `INSERT INTO workflows (
        id, name, description, status, created_at, updated_at,
        blockchain_id, blockchain_transaction_hash
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id)
      DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        status = EXCLUDED.status,
        updated_at = EXCLUDED.updated_at,
        blockchain_id = EXCLUDED.blockchain_id,
        blockchain_transaction_hash = EXCLUDED.blockchain_transaction_hash`,
      [
        workflow.id,
        workflow.name,
        workflow.description,
        workflow.status,
        workflow.createdAt,
        workflow.updatedAt,
        workflow.blockchainId,
        workflow.blockchainTransactionHash
      ]
    );

    return workflow;
  }

  async findAllWorkflows(): Promise<Workflow[]> {
    const result = await this.database.query(
      `SELECT id, name, description, status, created_at, updated_at,
        blockchain_id, blockchain_transaction_hash
      FROM workflows
      ORDER BY created_at ASC`
    );

    return result.rows.map(mapWorkflowRow);
  }

  async findWorkflowById(id: string): Promise<Workflow | undefined> {
    const result = await this.database.query(
      `SELECT id, name, description, status, created_at, updated_at,
        blockchain_id, blockchain_transaction_hash
      FROM workflows
      WHERE id = $1`,
      [id]
    );

    const row = result.rows[0];
    return row ? mapWorkflowRow(row) : undefined;
  }

  async saveRun(run: WorkflowRun): Promise<WorkflowRun> {
    await this.database.query(
      `INSERT INTO workflow_runs (
        id, workflow_id, status, input, output, error,
        created_at, started_at, completed_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id)
      DO UPDATE SET
        status = EXCLUDED.status,
        input = EXCLUDED.input,
        output = EXCLUDED.output,
        error = EXCLUDED.error,
        started_at = EXCLUDED.started_at,
        completed_at = EXCLUDED.completed_at`,
      [
        run.id,
        run.workflowId,
        run.status,
        JSON.stringify(run.input),
        run.output === null ? null : JSON.stringify(run.output),
        run.error,
        run.createdAt,
        run.startedAt,
        run.completedAt
      ]
    );

    return run;
  }

  async findRunById(id: string): Promise<WorkflowRun | undefined> {
    const result = await this.database.query(
      `SELECT id, workflow_id, status, input, output, error,
        created_at, started_at, completed_at
      FROM workflow_runs
      WHERE id = $1`,
      [id]
    );

    const row = result.rows[0];
    return row ? mapRunRow(row) : undefined;
  }
}

interface WorkflowRow {
  id: string;
  name: string;
  description: string;
  status: Workflow["status"];
  created_at: Date;
  updated_at: Date;
  blockchain_id: string | null;
  blockchain_transaction_hash: string | null;
}

interface WorkflowRunRow {
  id: string;
  workflow_id: string;
  status: WorkflowRun["status"];
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  error: string | null;
  created_at: Date;
  started_at: Date | null;
  completed_at: Date | null;
}

function mapWorkflowRow(row: WorkflowRow): Workflow {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    blockchainId: row.blockchain_id,
    blockchainTransactionHash: row.blockchain_transaction_hash
  };
}

function mapRunRow(row: WorkflowRunRow): WorkflowRun {
  return {
    id: row.id,
    workflowId: row.workflow_id,
    status: row.status,
    input: row.input,
    output: row.output,
    error: row.error,
    createdAt: row.created_at.toISOString(),
    startedAt: row.started_at?.toISOString() ?? null,
    completedAt: row.completed_at?.toISOString() ?? null
  };
}
