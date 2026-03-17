-- =============================================================
-- Al-Hayaat School — Dev Seed Data
-- Safe to re-run: uses fixed UUIDs / unique constraints
-- =============================================================

INSERT INTO users (id, email, password_hash, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@alhayaat.ca',
  '$2b$10$placeholder_hash_replace_before_use',
  'admin'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO newsletter_subscribers (id, email, active)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'newsletter-test@alhayaat.ca',
  TRUE
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO contact_submissions (id, name, email, phone, message)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'Sample Parent',
  'parent@example.com',
  '+15195550123',
  'Hello, I would like more information about admissions for next year.'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO job_applications (
  id,
  applicant_name,
  applicant_email,
  applicant_phone,
  position_title,
  resume_blob_url,
  cover_letter,
  status
)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  'Sample Applicant',
  'applicant@example.com',
  '+15195550124',
  'Elementary School Teacher',
  'https://example.blob.core.windows.net/resumes/sample-applicant.pdf',
  'I would love to support the school mission as a classroom teacher.',
  'pending'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO donations (
  id,
  stripe_session_id,
  amount_cad,
  donor_name,
  donor_email,
  donor_address,
  is_anonymous,
  status
)
VALUES (
  '00000000-0000-0000-0000-000000000005',
  'cs_test_seed_donation_001',
  250.00,
  'Sample Donor',
  'donor@example.com',
  '123 Test Street, Kitchener, ON',
  FALSE,
  'completed'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO applications (
  id,
  student_data,
  guardian_data,
  academic_data,
  additional_data,
  status
)
VALUES (
  '00000000-0000-0000-0000-000000000006',
  '{"firstName":"Fatima","lastName":"Ali","dateOfBirth":"2017-05-14","gradeApplyingFor":"Grade 3","previousSchool":"Sample Academy"}'::jsonb,
  '{"name":"Zahra Ali","relationship":"Mother","phone":"+15195550125","email":"guardian@example.com","address":"456 Example Avenue, Waterloo, ON"}'::jsonb,
  '{"currentGrade":"Grade 2","subjects":["Math","Language Arts"],"specialNeeds":"","languagesSpoken":["English","Arabic"]}'::jsonb,
  '{"howDidYouHear":"Community referral","additionalNotes":"Interested in September intake.","agreeToTerms":true}'::jsonb,
  'pending'
)
ON CONFLICT (id) DO NOTHING;
