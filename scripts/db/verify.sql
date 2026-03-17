-- =============================================================
-- Al-Hayaat School — Schema Verification
-- Run: psql $DATABASE_URL -v ON_ERROR_STOP=1 -f scripts/db/verify.sql
-- =============================================================

\echo 'Verifying required tables...'
DO $$
DECLARE
  missing_tables text[];
BEGIN
  SELECT array_agg(expected.table_name ORDER BY expected.table_name)
  INTO missing_tables
  FROM (
    VALUES
      ('applications'),
      ('contact_submissions'),
      ('donations'),
      ('job_applications'),
      ('newsletter_subscribers'),
      ('users')
  ) AS expected(table_name)
  WHERE NOT EXISTS (
    SELECT 1
    FROM information_schema.tables t
    WHERE t.table_schema = 'public'
      AND t.table_name = expected.table_name
  );

  IF missing_tables IS NOT NULL THEN
    RAISE EXCEPTION 'Missing required tables: %', array_to_string(missing_tables, ', ');
  END IF;
END $$;

\echo 'Verifying critical columns...'
DO $$
DECLARE
  missing_columns text[];
BEGIN
  SELECT array_agg(required.column_ref ORDER BY required.column_ref)
  INTO missing_columns
  FROM (
    VALUES
      ('contact_submissions.name'),
      ('contact_submissions.email'),
      ('contact_submissions.message'),
      ('job_applications.applicant_name'),
      ('job_applications.applicant_email'),
      ('job_applications.applicant_phone'),
      ('job_applications.position_title'),
      ('job_applications.resume_blob_url'),
      ('job_applications.cover_letter'),
      ('job_applications.submitted_at'),
      ('newsletter_subscribers.email'),
      ('newsletter_subscribers.active'),
      ('donations.stripe_session_id'),
      ('donations.amount_cad'),
      ('donations.donor_email'),
      ('applications.student_data'),
      ('applications.guardian_data'),
      ('applications.academic_data'),
      ('applications.additional_data'),
      ('applications.submitted_at'),
      ('users.email'),
      ('users.password_hash')
  ) AS required(column_ref)
  WHERE NOT EXISTS (
    SELECT 1
    FROM information_schema.columns c
    WHERE c.table_schema = 'public'
      AND c.table_name = split_part(required.column_ref, '.', 1)
      AND c.column_name = split_part(required.column_ref, '.', 2)
  );

  IF missing_columns IS NOT NULL THEN
    RAISE EXCEPTION 'Missing required columns: %', array_to_string(missing_columns, ', ');
  END IF;
END $$;

\echo 'Verifying required indexes...'
DO $$
DECLARE
  missing_indexes text[];
BEGIN
  SELECT array_agg(expected.index_name ORDER BY expected.index_name)
  INTO missing_indexes
  FROM (
    VALUES
      ('idx_contact_created'),
      ('idx_contact_email'),
      ('idx_job_applications_submitted'),
      ('idx_job_applications_status_submitted'),
      ('idx_donations_created'),
      ('idx_donations_email'),
      ('idx_applications_submitted'),
      ('idx_applications_status_submitted')
  ) AS expected(index_name)
  WHERE NOT EXISTS (
    SELECT 1
    FROM pg_indexes i
    WHERE i.schemaname = 'public'
      AND i.indexname = expected.index_name
  );

  IF missing_indexes IS NOT NULL THEN
    RAISE EXCEPTION 'Missing required indexes: %', array_to_string(missing_indexes, ', ');
  END IF;
END $$;

\echo 'Schema verification passed.'

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
