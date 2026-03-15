import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import type { Donation } from '@/lib/db/queries';

const CHARITY_REG_NUMBER = process.env.CHARITY_REG_NUMBER ?? '000000000 RR 0001';
const SCHOOL_ADDRESS = '158 Newbury Drive, Kitchener, ON, N2N 2N8';
const SCHOOL_PHONE = 'finance@alhayaat.ca';

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#1a1a1a',
  },
  header: {
    marginBottom: 32,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a5f',
    paddingBottom: 16,
  },
  schoolName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#1e3a5f',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1e3a5f',
    marginBottom: 8,
    marginTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: 160,
    fontFamily: 'Helvetica-Bold',
    color: '#555',
  },
  value: {
    flex: 1,
    color: '#1a1a1a',
  },
  amountBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 4,
    padding: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 10,
    color: '#555',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#1e3a5f',
  },
  legalText: {
    fontSize: 9,
    color: '#777',
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    lineHeight: 1.5,
  },
  footer: {
    fontSize: 9,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

interface ReceiptDocumentProps {
  donation: Donation;
}

function ReceiptDocument({ donation }: ReceiptDocumentProps) {
  const donorDisplayName = donation.isAnonymous
    ? 'Anonymous Donor'
    : (donation.donorName ?? 'Anonymous Donor');

  return (
    <Document title={`Tax Receipt — ${donorDisplayName}`} author="Al-Hayaat School">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.schoolName}>Al-Hayaat School</Text>
          <Text style={styles.subtitle}>Official Donation Tax Receipt</Text>
          <Text style={{ fontSize: 9, color: '#777', marginTop: 4 }}>
            {SCHOOL_ADDRESS} | {SCHOOL_PHONE}
          </Text>
          <Text style={{ fontSize: 9, color: '#777' }}>
            Charitable Registration Number: {CHARITY_REG_NUMBER}
          </Text>
        </View>

        {/* Receipt details */}
        <Text style={styles.sectionTitle}>Receipt Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Receipt Number:</Text>
          <Text style={styles.value}>{donation.id.toUpperCase()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date Issued:</Text>
          <Text style={styles.value}>{formatDate(new Date(donation.createdAt))}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Payment Method:</Text>
          <Text style={styles.value}>Credit Card (Stripe)</Text>
        </View>

        {/* Donor details */}
        <Text style={styles.sectionTitle}>Donor Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Donor Name:</Text>
          <Text style={styles.value}>{donorDisplayName}</Text>
        </View>
        {donation.donorAddress && (
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{donation.donorAddress}</Text>
          </View>
        )}

        {/* Amount */}
        <Text style={styles.sectionTitle}>Donation Amount</Text>
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Total eligible amount for tax purposes:</Text>
          <Text style={styles.amountValue}>{formatAmount(donation.amountCad)}</Text>
        </View>

        {/* Legal */}
        <Text style={styles.legalText}>
          This receipt is issued for a gift made to Al-Hayaat School, a registered Canadian charity.
          No goods or services were provided in exchange for this donation. This receipt may be used to claim
          a charitable tax credit on your Canadian income tax return. Please retain this receipt for your records.
          {'\n\n'}
          Al-Hayaat School | Charitable Registration No. {CHARITY_REG_NUMBER}
        </Text>
        <Text style={styles.footer}>
          Generated on {formatDate(new Date())} | Al-Hayaat School
        </Text>
      </Page>
    </Document>
  );
}

export async function generateReceipt(donation: Donation): Promise<Buffer> {
  const buffer = await renderToBuffer(<ReceiptDocument donation={donation} />);
  return Buffer.from(buffer);
}
