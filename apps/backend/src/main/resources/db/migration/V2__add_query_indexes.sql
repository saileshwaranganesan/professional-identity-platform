DROP INDEX IF EXISTS idx_projects_slug;

CREATE INDEX idx_projects_profile_id ON projects (profile_id);
CREATE INDEX idx_projects_profile_published ON projects (profile_id, published);
CREATE INDEX idx_educations_profile_id ON educations (profile_id);
CREATE INDEX idx_skills_profile_id ON skills (profile_id);
CREATE INDEX idx_certifications_profile_id ON certifications (profile_id);
CREATE INDEX idx_achievements_profile_display_order ON achievements (profile_id, display_order);
CREATE INDEX idx_social_links_profile_id ON social_links (profile_id);
