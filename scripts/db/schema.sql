-- =============================================================
-- Al-Hayaat School — PostgreSQL Schema
-- Run: psql $DATABASE_URL -f scripts/db/schema.sql
-- Idempotent: safe to re-run locally; includes compatibility fixes
-- =============================================================

-- gen_random_uuid() is built-in from PostgreSQL 13+; pgcrypto not needed.
-- Azure Database for PostgreSQL does not allow pgcrypto for non-superusers.
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(50),
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Careers / job applications
CREATE TABLE IF NOT EXISTS job_applications (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name   VARCHAR(255) NOT NULL,
  applicant_email  VARCHAR(255) NOT NULL,
  applicant_phone  VARCHAR(50),
  position_title   VARCHAR(255) NOT NULL,
  resume_blob_url  TEXT NOT NULL,
  cover_letter     TEXT,
  status           VARCHAR(50) NOT NULL DEFAULT 'pending',
  submitted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reconcile legacy column names if the table already exists from an older schema.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'job_applications'
      AND column_name = 'name'
  ) THEN
    EXECUTE 'ALTER TABLE job_applications RENAME COLUMN name TO applicant_name';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'job_applications'
      AND column_name = 'email'
  ) THEN
    EXECUTE 'ALTER TABLE job_applications RENAME COLUMN email TO applicant_email';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'job_applications'
      AND column_name = 'position'
  ) THEN
    EXECUTE 'ALTER TABLE job_applications RENAME COLUMN position TO position_title';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'job_applications'
      AND column_name = 'resume_url'
  ) THEN
    EXECUTE 'ALTER TABLE job_applications RENAME COLUMN resume_url TO resume_blob_url';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'job_applications'
      AND column_name = 'cover_note'
  ) THEN
    EXECUTE 'ALTER TABLE job_applications RENAME COLUMN cover_note TO cover_letter';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'job_applications'
      AND column_name = 'created_at'
  ) THEN
    EXECUTE 'ALTER TABLE job_applications RENAME COLUMN created_at TO submitted_at';
  END IF;
END $$;

ALTER TABLE job_applications
  ADD COLUMN IF NOT EXISTS applicant_phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  active        BOOLEAN NOT NULL DEFAULT TRUE
);

-- Donations (Stripe-backed)
CREATE TABLE IF NOT EXISTS donations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT NOT NULL UNIQUE,
  amount_cad        NUMERIC(10,2) NOT NULL,
  donor_name        TEXT,
  donor_email       TEXT NOT NULL,
  donor_address     TEXT,
  is_anonymous      BOOLEAN NOT NULL DEFAULT FALSE,
  status            TEXT NOT NULL DEFAULT 'completed',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enrollment applications
CREATE TABLE IF NOT EXISTS applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_data    JSONB NOT NULL,
  guardian_data   JSONB NOT NULL,
  academic_data   JSONB NOT NULL,
  additional_data JSONB NOT NULL,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status          TEXT NOT NULL DEFAULT 'pending'
);

-- Admin users / auth groundwork
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contact_created
  ON contact_submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_email
  ON contact_submissions (email);

CREATE INDEX IF NOT EXISTS idx_job_applications_submitted
  ON job_applications (submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_job_applications_status_submitted
  ON job_applications (status, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_donations_created
  ON donations (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_donations_email
  ON donations (donor_email);

CREATE INDEX IF NOT EXISTS idx_applications_submitted
  ON applications (submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_applications_status_submitted
  ON applications (status, submitted_at DESC);
