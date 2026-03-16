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

interface ApplicationConfirmationEmailProps {
  guardianName: string;
  studentName: string;
}

export function ApplicationConfirmationEmail({
  guardianName,
  studentName,
}: ApplicationConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: '32px auto', backgroundColor: '#ffffff', borderRadius: 8, overflow: 'hidden' }}>
          {/* Header */}
          <Section style={{ backgroundColor: '#1e3a5f', padding: '32px 40px' }}>
            <Heading as="h1" style={{ color: '#ffffff', margin: 0, fontSize: 22 }}>
              Al-Hayaat School
            </Heading>
            <Text style={{ color: '#93c5fd', margin: '4px 0 0', fontSize: 14 }}>
              Enrollment Application Received
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: '32px 40px' }}>
            <Text style={{ fontSize: 16, color: '#1a1a1a', marginBottom: 16 }}>
              Dear {guardianName},
            </Text>
            <Text style={{ fontSize: 15, color: '#374151', lineHeight: '1.6', marginBottom: 24 }}>
              Thank you for submitting an enrollment application for <strong>{studentName}</strong> at
              Al-Hayaat School. We have received your application and our admissions team will review
              it carefully.
            </Text>

            <Section style={{ backgroundColor: '#eff6ff', borderRadius: 8, padding: '16px 24px', marginBottom: 24 }}>
              <Text style={{ fontSize: 13, color: '#1e40af', fontWeight: 'bold', margin: '0 0 8px' }}>
                What happens next?
              </Text>
              <Text style={{ fontSize: 13, color: '#374151', margin: '0 0 6px', lineHeight: '1.6' }}>
                1. Our admissions team will review your application within 5–7 business days.
              </Text>
              <Text style={{ fontSize: 13, color: '#374151', margin: '0 0 6px', lineHeight: '1.6' }}>
                2. We may contact you for additional information or to schedule an interview.
              </Text>
              <Text style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: '1.6' }}>
                3. You will receive a decision letter by email once the review is complete.
              </Text>
            </Section>

            <Text style={{ fontSize: 14, color: '#374151', lineHeight: '1.6' }}>
              If you have any questions about your application, please don&apos;t hesitate to contact
              our admissions office.
            </Text>
          </Section>

          <Hr style={{ borderColor: '#e5e7eb', margin: '0 40px' }} />

          {/* Footer */}
          <Section style={{ padding: '24px 40px' }}>
            <Text style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
              Al-Hayaat School | 158 Newbury Drive, Kitchener, ON, N2N 2N8
            </Text>
            <Text style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>
              Admissions enquiries:{' '}
              <Link href="mailto:admissions@alhayaat.ca" style={{ color: '#2563eb' }}>
                admissions@alhayaat.ca
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
