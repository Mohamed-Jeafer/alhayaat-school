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

interface NewsletterConfirmationEmailProps {
  email: string;
}

export function NewsletterConfirmationEmail({
  email,
}: NewsletterConfirmationEmailProps) {
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
              You&apos;re now subscribed to our newsletter
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: '32px 40px' }}>
            <Text style={{ fontSize: 15, color: '#374151', lineHeight: '1.6', marginBottom: 24 }}>
              Thank you for subscribing to the Al-Hayaat School newsletter! You will now receive
              updates about school events, announcements, and important news directly in your inbox.
            </Text>

            <Section style={{ backgroundColor: '#f0fdf4', borderRadius: 8, padding: '16px 24px', marginBottom: 24 }}>
              <Text style={{ fontSize: 13, color: '#166534', margin: 0 }}>
                Subscribed address: <strong>{email}</strong>
              </Text>
            </Section>

            <Text style={{ fontSize: 14, color: '#374151', lineHeight: '1.6' }}>
              If you did not sign up for this newsletter or believe this was sent in error, you can
              safely ignore this email. No further action is required.
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
