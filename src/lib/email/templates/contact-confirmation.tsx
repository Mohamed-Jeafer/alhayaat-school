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

interface ContactConfirmationEmailProps {
  name: string;
  message: string;
}

export function ContactConfirmationEmail({
  name,
  message,
}: ContactConfirmationEmailProps) {
  const preview = message.length > 120 ? message.slice(0, 120) + '…' : message;

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
              We received your message
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: '32px 40px' }}>
            <Text style={{ fontSize: 16, color: '#1a1a1a', marginBottom: 16 }}>
              Dear {name},
            </Text>
            <Text style={{ fontSize: 15, color: '#374151', lineHeight: '1.6', marginBottom: 24 }}>
              Thank you for reaching out to Al-Hayaat School. We have received your message and a
              member of our team will get back to you within 1–2 business days.
            </Text>

            {/* Message preview */}
            <Section style={{ backgroundColor: '#f3f4f6', borderRadius: 8, padding: '16px 24px', marginBottom: 24 }}>
              <Text style={{ fontSize: 13, color: '#6b7280', fontWeight: 'bold', margin: '0 0 8px' }}>
                Your message
              </Text>
              <Text style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: '1.6' }}>
                {preview}
              </Text>
            </Section>

            <Text style={{ fontSize: 14, color: '#374151', lineHeight: '1.6' }}>
              If your matter is urgent, please call us directly or visit our office during school
              hours.
            </Text>
          </Section>

          <Hr style={{ borderColor: '#e5e7eb', margin: '0 40px' }} />

          {/* Footer */}
          <Section style={{ padding: '24px 40px' }}>
            <Text style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
              Al-Hayaat School | 158 Newbury Drive, Kitchener, ON, N2N 2N8
            </Text>
            <Text style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>
              Questions? Email us at{' '}
              <Link href="mailto:info@alhayaat.ca" style={{ color: '#2563eb' }}>
                info@alhayaat.ca
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
