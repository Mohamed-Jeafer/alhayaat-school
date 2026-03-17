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

interface JobApplicationConfirmationEmailProps {
  name: string;
  position: string;
}

export function JobApplicationConfirmationEmail({
  name,
  position,
}: JobApplicationConfirmationEmailProps) {
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
              Job Application Received
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: '32px 40px' }}>
            <Text style={{ fontSize: 16, color: '#1a1a1a', marginBottom: 16 }}>
              Dear {name},
            </Text>
            <Text style={{ fontSize: 15, color: '#374151', lineHeight: '1.6', marginBottom: 24 }}>
              Thank you for your interest in joining the Al-Hayaat School team. We have received your
              application for the <strong>{position}</strong> position and it is currently under
              review.
            </Text>

            <Section style={{ backgroundColor: '#fefce8', borderRadius: 8, padding: '16px 24px', marginBottom: 24 }}>
              <Text style={{ fontSize: 13, color: '#854d0e', fontWeight: 'bold', margin: '0 0 8px' }}>
                Next steps
              </Text>
              <Text style={{ fontSize: 13, color: '#374151', margin: '0 0 6px', lineHeight: '1.6' }}>
                Our hiring team will review all applications and reach out to shortlisted candidates
                within 2–3 weeks.
              </Text>
              <Text style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: '1.6' }}>
                Due to the volume of applications we receive, we may not be able to respond to every
                applicant individually.
              </Text>
            </Section>

            <Text style={{ fontSize: 14, color: '#374151', lineHeight: '1.6' }}>
              We appreciate your interest in contributing to our school community and wish you the
              best of luck in your application.
            </Text>
          </Section>

          <Hr style={{ borderColor: '#e5e7eb', margin: '0 40px' }} />

          {/* Footer */}
          <Section style={{ padding: '24px 40px' }}>
            <Text style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
              Al-Hayaat School | 158 Newbury Drive, Kitchener, ON, N2N 2N8
            </Text>
            <Text style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>
              HR enquiries:{' '}
              <Link href="mailto:hr@alhayaat.ca" style={{ color: '#2563eb' }}>
                hr@alhayaat.ca
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
