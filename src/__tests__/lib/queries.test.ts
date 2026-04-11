import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the db module — all query functions delegate to db.query
vi.mock('@/lib/db', () => ({
  db: {
    query: vi.fn(),
  },
}));

import { db } from '@/lib/db';
import {
  createContactSubmission,
  upsertNewsletterSubscriber,
  createDonation,
  createApplication,
  createJobApplication,
  listDonations,
  getDashboardStats,
} from '@/lib/db/queries';

const mockQuery = db.query as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

// ── createContactSubmission ───────────────────────────────────────────────────

describe('createContactSubmission', () => {
  it('inserts a row with name, email, phone, and message', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await createContactSubmission({
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      phone: '+16135550100',
      message: 'I have a question about enrollment.',
    });

    expect(mockQuery).toHaveBeenCalledOnce();
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toContain('INSERT INTO contact_submissions');
    expect(params).toEqual(['Ahmed Ali', 'ahmed@example.com', '+16135550100', 'I have a question about enrollment.']);
  });

  it('passes null for optional phone when not provided', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await createContactSubmission({ name: 'Fatima', email: 'f@example.com', message: 'Hello' });

    const [, params] = mockQuery.mock.calls[0];
    expect(params[2]).toBeNull();
  });
});

// ── upsertNewsletterSubscriber ────────────────────────────────────────────────

describe('upsertNewsletterSubscriber', () => {
  it('returns { isNew: true } when inserting a brand-new email', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ isNew: true }] });

    const result = await upsertNewsletterSubscriber('new@example.com');

    expect(result.isNew).toBe(true);
    const [sql] = mockQuery.mock.calls[0];
    expect(sql).toContain('ON CONFLICT');
  });

  it('returns { isNew: false } when email already exists', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ isNew: false }] });

    const result = await upsertNewsletterSubscriber('existing@example.com');

    expect(result.isNew).toBe(false);
  });

  it('returns { isNew: false } as fallback when query returns no rows', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await upsertNewsletterSubscriber('x@example.com');

    expect(result.isNew).toBe(false);
  });
});

// ── createDonation ────────────────────────────────────────────────────────────

const mockDonation = {
  id: 'don-uuid-1',
  stripeSessionId: 'cs_test_abc123',
  amountCad: 100.00,
  donorName: 'Sara Hassan',
  donorEmail: 'sara@example.com',
  donorAddress: '123 Main St, Ottawa',
  isAnonymous: false,
  status: 'completed',
  createdAt: new Date('2026-04-11T00:00:00Z'),
};

describe('createDonation', () => {
  it('returns the inserted donation on success', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [mockDonation] });

    const result = await createDonation({
      stripeSessionId: 'cs_test_abc123',
      amountCad: 100.00,
      donorName: 'Sara Hassan',
      donorEmail: 'sara@example.com',
      donorAddress: '123 Main St, Ottawa',
      isAnonymous: false,
    });

    expect(result).toMatchObject({
      stripeSessionId: 'cs_test_abc123',
      amountCad: 100.00,
      donorEmail: 'sara@example.com',
    });
  });

  it('returns null when session_id already exists (ON CONFLICT DO NOTHING)', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] }); // no RETURNING row = conflict

    const result = await createDonation({
      stripeSessionId: 'cs_test_duplicate',
      amountCad: 50,
      donorName: null,
      donorEmail: 'donor@example.com',
      isAnonymous: true,
    });

    expect(result).toBeNull();
  });

  it('uses null for anonymous donor name and missing address', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ ...mockDonation, donorName: null, donorAddress: null }] });

    await createDonation({
      stripeSessionId: 'cs_anon',
      amountCad: 25,
      donorName: null,
      donorEmail: 'anon@example.com',
      isAnonymous: true,
    });

    const [, params] = mockQuery.mock.calls[0];
    expect(params[2]).toBeNull(); // donorName
    expect(params[4]).toBeNull(); // donorAddress
  });
});

// ── createApplication ─────────────────────────────────────────────────────────

const mockApplication = {
  id: 'app-uuid-1',
  student_data: { firstName: 'Yusuf', lastName: 'Omar' },
  guardian_data: { name: 'Omar Hassan', email: 'omar@example.com' },
  academic_data: { currentGrade: 'Grade 3' },
  additional_data: { howDidYouHear: 'Friend' },
  submitted_at: new Date(),
  status: 'pending',
};

describe('createApplication', () => {
  it('returns application with pending status on success', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [mockApplication] });

    const result = await createApplication({
      studentData: { firstName: 'Yusuf', lastName: 'Omar' },
      guardianData: { name: 'Omar Hassan', email: 'omar@example.com' },
      academicData: { currentGrade: 'Grade 3' },
      additionalData: { howDidYouHear: 'Friend' },
    });

    expect(result?.status).toBe('pending');
    expect(result?.student_data).toMatchObject({ firstName: 'Yusuf' });
  });

  it('returns null when no rows returned', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });

    const result = await createApplication({
      studentData: {}, guardianData: {}, academicData: {}, additionalData: {},
    });

    expect(result).toBeNull();
  });

  it('serializes JSONB fields as JSON strings in query params', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [mockApplication] });

    await createApplication({
      studentData: { firstName: 'Yusuf' },
      guardianData: { name: 'Omar' },
      academicData: { grade: '3' },
      additionalData: { notes: 'none' },
    });

    const [, params] = mockQuery.mock.calls[0];
    expect(typeof params[0]).toBe('string'); // JSON serialized
    expect(JSON.parse(params[0])).toMatchObject({ firstName: 'Yusuf' });
  });
});

// ── createJobApplication ──────────────────────────────────────────────────────

const mockJobApp = {
  id: 'job-uuid-1',
  applicant_name: 'Layla Nour',
  applicant_email: 'layla@example.com',
  applicant_phone: '+16135550200',
  position_title: 'Arabic Teacher',
  resume_blob_url: 'https://storage.blob.core.windows.net/resumes/uuid-resume.pdf',
  cover_letter: 'I am passionate about Islamic education.',
  submitted_at: new Date(),
  status: 'pending',
};

describe('createJobApplication', () => {
  it('returns the job application on success', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [mockJobApp] });

    const result = await createJobApplication({
      applicantName: 'Layla Nour',
      applicantEmail: 'layla@example.com',
      applicantPhone: '+16135550200',
      positionTitle: 'Arabic Teacher',
      resumeBlobUrl: 'https://storage.blob.core.windows.net/resumes/uuid-resume.pdf',
      coverLetter: 'I am passionate about Islamic education.',
    });

    expect(result?.applicant_name).toBe('Layla Nour');
    expect(result?.status).toBe('pending');
  });

  it('passes null for optional phone and cover letter when not provided', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ ...mockJobApp, applicant_phone: null, cover_letter: null }] });

    await createJobApplication({
      applicantName: 'Test',
      applicantEmail: 't@example.com',
      positionTitle: 'Teacher',
      resumeBlobUrl: 'https://blob/resume.pdf',
    });

    const [, params] = mockQuery.mock.calls[0];
    expect(params[2]).toBeNull(); // phone
    expect(params[5]).toBeNull(); // cover letter
  });
});

// ── listDonations ─────────────────────────────────────────────────────────────

describe('listDonations', () => {
  it('returns paginated donations with correct metadata', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [mockDonation] })   // data
      .mockResolvedValueOnce({ rows: [{ count: '42' }] }); // count

    const result = await listDonations({ page: 2, perPage: 10 });

    expect(result.donations).toHaveLength(1);
    expect(result.total).toBe(42);
    expect(result.page).toBe(2);
    expect(result.perPage).toBe(10);
    expect(result.totalPages).toBe(5); // ceil(42/10)
  });

  it('passes search term to both queries', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ count: '0' }] });

    await listDonations({ page: 1, perPage: 25, search: 'sara' });

    expect(mockQuery.mock.calls[0][1]).toContain('sara');
    expect(mockQuery.mock.calls[1][1]).toContain('sara');
  });
});

// ── getDashboardStats ─────────────────────────────────────────────────────────

describe('getDashboardStats', () => {
  it('returns correctly typed numeric stats from string DB results', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ total: '12' }] })              // contacts
      .mockResolvedValueOnce({ rows: [{ total: '5', pending: '3' }] }) // jobs
      .mockResolvedValueOnce({ rows: [{ total: '88' }] })              // subscribers
      .mockResolvedValueOnce({ rows: [{ total: '7', total_amount: '1250.50' }] }) // donations
      .mockResolvedValueOnce({ rows: [] });                             // activity

    const stats = await getDashboardStats();

    expect(stats.contactSubmissions.total).toBe(12);
    expect(stats.jobApplications.total).toBe(5);
    expect(stats.jobApplications.pending).toBe(3);
    expect(stats.newsletterSubscribers.total).toBe(88);
    expect(stats.donations.total).toBe(7);
    expect(stats.donations.totalAmountCad).toBe(1250.50);
    expect(stats.recentActivity).toEqual([]);
  });

  it('maps recent activity rows to the correct type', async () => {
    const activityRow = {
      type: 'contact',
      id: 'some-uuid',
      summary: 'Ahmed Ali — I have a question...',
      created_at: '2026-04-11T00:00:00Z',
    };
    mockQuery
      .mockResolvedValueOnce({ rows: [{ total: '1' }] })
      .mockResolvedValueOnce({ rows: [{ total: '0', pending: '0' }] })
      .mockResolvedValueOnce({ rows: [{ total: '0' }] })
      .mockResolvedValueOnce({ rows: [{ total: '0', total_amount: '0' }] })
      .mockResolvedValueOnce({ rows: [activityRow] });

    const stats = await getDashboardStats();

    expect(stats.recentActivity[0]).toMatchObject({
      type: 'contact',
      id: 'some-uuid',
      summary: 'Ahmed Ali — I have a question...',
    });
  });
});
