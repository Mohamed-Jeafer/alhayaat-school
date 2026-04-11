import { vi } from 'vitest';

// ── Environment variables ─────────────────────────────────────────────────────
// Set minimal env vars so modules that read them at import time don't throw.
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.MAIL_SENDER_ADDRESS = 'noreply@alhayaat.ca';
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock';
process.env.AZURE_STORAGE_CONNECTION_STRING =
  'DefaultEndpointsProtocol=https;AccountName=test;AccountKey=dGVzdA==;EndpointSuffix=core.windows.net';

// ── Suppress logger output in tests ──────────────────────────────────────────
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));
