ALTER TABLE workflows
    ADD COLUMN IF NOT EXISTS blockchain_id VARCHAR(66),
    ADD COLUMN IF NOT EXISTS blockchain_transaction_hash VARCHAR(66);

CREATE UNIQUE INDEX IF NOT EXISTS idx_workflows_blockchain_id
    ON workflows(blockchain_id)
    WHERE blockchain_id IS NOT NULL;
