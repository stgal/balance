-- Create users table (projection/read model)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  balance BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create events table (event store)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY,
  aggregate_id VARCHAR(100) NOT NULL,
  aggregate_type VARCHAR(100) NOT NULL,
  version INTEGER NOT NULL,
  type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create regular indexes for query optimization
CREATE INDEX IF NOT EXISTS events_aggregate_id_idx ON events(aggregate_id);
CREATE INDEX IF NOT EXISTS events_aggregate_type_idx ON events(aggregate_type);
CREATE INDEX IF NOT EXISTS events_type_idx ON events(type);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events(created_at);

-- Create unique constraint for optimistic locking
-- This is the critical index that enforces version uniqueness per aggregate
CREATE UNIQUE INDEX IF NOT EXISTS events_optimistic_lock_idx ON events(aggregate_type, aggregate_id, version);
