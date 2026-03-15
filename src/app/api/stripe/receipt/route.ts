import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateReceipt } from '@/lib/pdf/receipt';
import type { Donation } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const { rows } = await db.query<Donation>(
      `SELECT id, stripe_session_id AS "stripeSessionId", amount_cad AS "amountCad",
              donor_name AS "donorName", donor_email AS "donorEmail",
              donor_address AS "donorAddress", is_anonymous AS "isAnonymous",
              status, created_at AS "createdAt"
       FROM   donations
       WHERE  stripe_session_id = $1`,
      [sessionId]
    );

    if (!rows[0]) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    const pdfBuffer = await generateReceipt(rows[0]);
    const receiptId = rows[0].id.substring(0, 8);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receipt-${receiptId}.pdf"`,
        'Content-Length': String(pdfBuffer.length),
      },
    });
  } catch (err) {
    console.error('[receipt] Failed to generate receipt:', err);
    return NextResponse.json({ error: 'Failed to generate receipt' }, { status: 500 });
  }
}
