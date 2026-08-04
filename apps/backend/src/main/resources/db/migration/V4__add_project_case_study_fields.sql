ALTER TABLE projects
    ADD COLUMN problem_statement TEXT,
    ADD COLUMN solution TEXT,
    ADD COLUMN architecture_details TEXT,
    ADD COLUMN security_practices TEXT,
    ADD COLUMN database_design TEXT,
    ADD COLUMN api_design TEXT,
    ADD COLUMN lessons_learned TEXT,
    ADD COLUMN future_roadmap TEXT;

CREATE TABLE project_highlights (
    project_id UUID NOT NULL,
    highlight VARCHAR(255) NOT NULL,
    CONSTRAINT fk_project_highlights_project FOREIGN KEY (project_id) REFERENCES projects (id)
);

CREATE INDEX idx_project_highlights_project_id ON project_highlights(project_id);

CREATE TABLE project_screenshots (
    project_id UUID NOT NULL,
    screenshot_url VARCHAR(500) NOT NULL,
    CONSTRAINT fk_project_screenshots_project FOREIGN KEY (project_id) REFERENCES projects (id)
);

CREATE INDEX idx_project_screenshots_project_id ON project_screenshots(project_id);
