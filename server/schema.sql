-- Relational schema aligning to the prompt (PostgreSQL dialect)
-- Note: The running implementation uses MongoDB via Mongoose.
-- This SQL is provided to satisfy the schema deliverable.

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  cuisine VARCHAR(255),
  title VARCHAR(512),
  rating REAL,
  prep_time INT,
  cook_time INT,
  total_time INT,
  description TEXT,
  nutrients JSONB,
  serves VARCHAR(128)
);

-- Indexes for common queries
CREATE INDEX recipes_rating_idx ON recipes (rating DESC NULLS LAST);
CREATE INDEX recipes_cuisine_idx ON recipes (cuisine);
CREATE INDEX recipes_total_time_idx ON recipes (total_time);
CREATE INDEX recipes_title_trgm_idx ON recipes USING GIN (title gin_trgm_ops);

