CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    username VARCHAR(100) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    headline VARCHAR(255),
    bio VARCHAR(5000),
    location VARCHAR(255),
    website VARCHAR(512),
    phone VARCHAR(50),
    profile_image_path VARCHAR(512),
    banner_image_path VARCHAR(512)
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    enabled BOOLEAN NOT NULL,
    email_verified BOOLEAN NOT NULL,
    profile_id UUID NOT NULL UNIQUE,
    CONSTRAINT fk_users_profile FOREIGN KEY (profile_id) REFERENCES profiles (id)
);

CREATE TABLE projects (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    headline VARCHAR(250),
    short_description VARCHAR(500),
    description TEXT,
    github_url VARCHAR(500),
    live_demo_url VARCHAR(500),
    documentation_url VARCHAR(500),
    featured BOOLEAN NOT NULL,
    published BOOLEAN NOT NULL,
    impact TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20),
    profile_id UUID NOT NULL,
    CONSTRAINT fk_projects_profile FOREIGN KEY (profile_id) REFERENCES profiles (id)
);

CREATE INDEX idx_projects_slug ON projects (slug);
CREATE INDEX idx_projects_featured ON projects (featured);
CREATE INDEX idx_projects_published ON projects (published);
CREATE INDEX idx_projects_status ON projects (status);

CREATE TABLE experiences (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    company VARCHAR(200) NOT NULL,
    position VARCHAR(200) NOT NULL,
    employment_type VARCHAR(20) NOT NULL,
    employment_status VARCHAR(20) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    technologies TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    currently_working BOOLEAN NOT NULL,
    company_website VARCHAR(500),
    company_logo VARCHAR(500),
    display_order INTEGER NOT NULL,
    profile_id UUID NOT NULL,
    CONSTRAINT fk_experiences_profile FOREIGN KEY (profile_id) REFERENCES profiles (id)
);

CREATE INDEX idx_experiences_profile_display_order ON experiences (profile_id, display_order);

CREATE TABLE educations (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(200) NOT NULL,
    field_of_study VARCHAR(200),
    start_date DATE NOT NULL,
    end_date DATE,
    grade VARCHAR(100),
    description VARCHAR(2000),
    currently_studying BOOLEAN NOT NULL,
    profile_id UUID NOT NULL,
    CONSTRAINT fk_educations_profile FOREIGN KEY (profile_id) REFERENCES profiles (id)
);

CREATE TABLE skills (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL,
    category VARCHAR(100),
    display_order INTEGER,
    profile_id UUID NOT NULL,
    CONSTRAINT fk_skills_profile FOREIGN KEY (profile_id) REFERENCES profiles (id)
);

CREATE TABLE certifications (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    name VARCHAR(200) NOT NULL,
    issuing_organization VARCHAR(200) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    credential_id VARCHAR(200),
    credential_url VARCHAR(500),
    does_not_expire BOOLEAN NOT NULL,
    display_order INTEGER,
    profile_id UUID NOT NULL,
    CONSTRAINT fk_certifications_profile FOREIGN KEY (profile_id) REFERENCES profiles (id)
);

CREATE TABLE achievements (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    title VARCHAR(200) NOT NULL,
    organization VARCHAR(200) NOT NULL,
    achievement_date DATE NOT NULL,
    description VARCHAR(2000),
    achievement_url VARCHAR(500),
    display_order INTEGER,
    profile_id UUID NOT NULL,
    CONSTRAINT fk_achievements_profile FOREIGN KEY (profile_id) REFERENCES profiles (id)
);

CREATE TABLE social_links (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    platform VARCHAR(20) NOT NULL,
    url VARCHAR(500) NOT NULL,
    display_order INTEGER,
    profile_id UUID NOT NULL,
    CONSTRAINT fk_social_links_profile FOREIGN KEY (profile_id) REFERENCES profiles (id)
);
