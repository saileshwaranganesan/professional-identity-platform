-- Add richer hero metadata
ALTER TABLE projects
    ADD COLUMN role VARCHAR(100),
    ADD COLUMN duration VARCHAR(100),
    ADD COLUMN team_size INT;

-- Drop old screenshots table
DROP TABLE IF EXISTS project_screenshots;

-- Drop hardcoded text columns from projects
ALTER TABLE projects
    DROP COLUMN problem_statement,
    DROP COLUMN solution,
    DROP COLUMN architecture_details,
    DROP COLUMN security_practices,
    DROP COLUMN database_design,
    DROP COLUMN api_design,
    DROP COLUMN lessons_learned,
    DROP COLUMN future_roadmap;

-- Create dynamic JSONB blocks table
CREATE TABLE project_blocks (
    id UUID PRIMARY KEY,
    project_id UUID NOT NULL,
    block_type VARCHAR(50) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    payload JSONB NOT NULL,
    CONSTRAINT fk_project_blocks_project FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

CREATE INDEX idx_project_blocks_project_id ON project_blocks(project_id);
