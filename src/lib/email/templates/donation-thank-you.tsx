import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
} from '@react-email/components';

interface DonationThankYouEmailProps {
  donorName: string;
  amountCad: number;
  receiptNumber: string;
  donationDate: string;
  bodyText: string;
  charityNote: string;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

export function DonationThankYouEmail({
  donorName,
  amountCad,
  receiptNumber,
  donationDate,
  bodyText,
  charityNote,
}: DonationThankYouEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: '32px auto', backgroundColor: '#ffffff', borderRadius: 8, overflow: 'hidden' }}>
          {/* Header */}
          <Section style={{ backgroundColor: '#1453a5', padding: '32px 40px' }}>
            <Heading as="h1" style={{ color: '#ffffff', margin: 0, fontSize: 22 }}>
              Al-Hayaat School
            </Heading>
            <Text style={{ color: '#93c5fd', margin: '4px 0 0', fontSize: 14 }}>
              Thank you for your generous donation
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: '32px 40px' }}>
            <Text style={{ fontSize: 16, color: '#1a1a1a', marginBottom: 16 }}>
              Dear {donorName},
            </Text>
            <Text style={{ fontSize: 15, color: '#374151', lineHeight: '1.6', marginBottom: 24 }}>
              JazakAllahu Khayran for your generous contribution to Al-Hayaat School.
              Your donation of <strong>{formatAmount(amountCad)}</strong> on {donationDate} has been
              received. {bodyText}
            </Text>

            {/* Receipt box */}
            <Section style={{ backgroundColor: '#eff6ff', borderRadius: 8, padding: '16px 24px', marginBottom: 24 }}>
              <Text style={{ fontSize: 13, color: '#1e40af', fontWeight: 'bold', margin: '0 0 8px' }}>
                Official Tax Receipt
              </Text>
              <Text style={{ fontSize: 13, color: '#374151', margin: '0 0 4px' }}>
                Receipt No: {receiptNumber}
              </Text>
              <Text style={{ fontSize: 13, color: '#374151', margin: 0 }}>
                Amount: {formatAmount(amountCad)} CAD
              </Text>
              <Text style={{ fontSize: 11, color: '#6b7280', margin: '8px 0 0' }}>
                {charityNote}
              </Text>
            </Section>

            <Text style={{ fontSize: 14, color: '#374151', lineHeight: '1.6' }}>
              May Allah bless your generosity and grant you goodness in this life and the next.
            </Text>
          </Section>

          <Hr style={{ borderColor: '#e5e7eb', margin: '0 40px' }} />

          {/* Footer */}
          <Section style={{ padding: '24px 40px' }}>
            <Text style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
              Al-Hayaat School | 158 Newbury Drive, Kitchener, ON, N2N 2N8
            </Text>
            <Text style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>
              Questions? Contact us at{' '}
              <Link href="mailto:finance@alhayaat.ca" style={{ color: '#2563eb' }}>
                finance@alhayaat.ca
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
