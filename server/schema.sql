CREATE DATABASE auth_db;

\c auth_db;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL DEFAULT 'client'
        CHECK (user_type IN ('client', 'talent')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    title VARCHAR(255),
    bio TEXT,
    experience TEXT,
    location VARCHAR(255),
    image VARCHAR(255),
    projects_posted INTEGER DEFAULT 0,
    hires_made INTEGER DEFAULT 0,
    profile_views INTEGER DEFAULT 0,
    applications_sent INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE user_skills (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE talent (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    availability VARCHAR(100),
    hourly_rate NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION create_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_profile();

ALTER TABLE profiles ADD COLUMN skills JSONB DEFAULT '[]'::jsonb;

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,
    job_type VARCHAR(100) NOT NULL,
    budget NUMERIC(10,2),
    description TEXT,
    location VARCHAR(255),
    image VARCHAR(255),

    status VARCHAR(20) DEFAULT 'open',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,

    job_id INTEGER UNIQUE REFERENCES jobs(id) ON DELETE CASCADE,

    talent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

    status VARCHAR(20) DEFAULT 'accepted',

    rating INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    talent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);