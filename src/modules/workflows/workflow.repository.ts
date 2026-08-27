import type { Pool } from "pg";
import { db } from "../../config/database.js";
import type {
  Workflow,
  WorkflowRun
} from "./workflow.types.js";

export class WorkflowRepository {
  private readonly database: Pool;

  constructor(database: Pool = db) {
    this.database = database;
  }

  async saveWorkflow(workflow: Workflow): Promise<Workflow> {
    await this.database.query(
      `INSERT INTO workflows (
        id,
        name,
        description,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id)
      DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        status = EXCLUDED.status,
        updated_at = EXCLUDED.updated_at`,
      [
        workflow.id,
        workflow.name,
        workflow.description,
        workflow.status,
        workflow.createdAt,
        workflow.updatedAt
      ]
    );

    return workflow;
  }

  async findAllWorkflows(): Promise<Workflow[]> {
    const result = await this.database.query(
      `SELECT
        id,
        name,
        description,
        status,
        created_at,
        updated_at
      FROM workflows
      ORDER BY created_at ASC`
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      status: row.status,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    }));
  }

  async findWorkflowById(id: string): Promise<Workflow | undefined> {
    const result = await this.database.query(
      `SELECT
        id,
        name,
        description,
        status,
        created_at,
        updated_at
      FROM workflows
      WHERE id = $1`,
      [id]
    );

    const row = result.rows[0];

    if (!row) {
      return undefined;
    }

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      status: row.status,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
  }

  async saveRun(run: WorkflowRun): Promise<WorkflowRun> {
    await this.database.query(
      `INSERT INTO workflow_runs (
        id,
        workflow_id,
        status,
        input,
        output,
        error,
        created_at,
        started_at,
        completed_at
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
      `SELECT
        id,
        workflow_id,
        status,
        input,
        output,
        error,
        created_at,
        started_at,
        completed_at
      FROM workflow_runs
      WHERE id = $1`,
      [id]
    );

    const row = result.rows[0];

    if (!row) {
      return undefined;
    }

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
}
