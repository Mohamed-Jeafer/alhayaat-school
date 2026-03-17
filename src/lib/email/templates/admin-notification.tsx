import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from '@react-email/components';

interface AdminNotificationEmailProps {
  formType: string;
  name: string;
  email: string;
  details?: Record<string, string>;
}

export function AdminNotificationEmail({
  formType,
  name,
  email,
  details,
}: AdminNotificationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: '32px auto', backgroundColor: '#ffffff', borderRadius: 8, overflow: 'hidden' }}>
          {/* Header */}
          <Section style={{ backgroundColor: '#1453a5', padding: '24px 40px' }}>
            <Heading as="h1" style={{ color: '#ffffff', margin: 0, fontSize: 20 }}>
              Al-Hayaat School — Admin Notification
            </Heading>
            <Text style={{ color: '#93c5fd', margin: '4px 0 0', fontSize: 14 }}>
              New {formType} submission
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: '32px 40px' }}>
            <Text style={{ fontSize: 15, color: '#374151', lineHeight: '1.6', marginBottom: 8 }}>
              A new <strong>{formType}</strong> submission has been received.
            </Text>

            {/* Sender details */}
            <Section style={{ backgroundColor: '#eff6ff', borderRadius: 8, padding: '16px 24px', marginBottom: 24 }}>
              <Text style={{ fontSize: 13, color: '#1e40af', fontWeight: 'bold', margin: '0 0 8px' }}>
                Submission Details
              </Text>
              <Text style={{ fontSize: 13, color: '#374151', margin: '0 0 4px' }}>
                <strong>Name:</strong> {name}
              </Text>
              <Text style={{ fontSize: 13, color: '#374151', margin: '0 0 4px' }}>
                <strong>Email:</strong> {email}
              </Text>
              {details &&
                Object.entries(details).map(([key, value]) => (
                  <Text key={key} style={{ fontSize: 13, color: '#374151', margin: '0 0 4px' }}>
                    <strong>{key}:</strong> {value}
                  </Text>
                ))}
            </Section>

            <Text style={{ fontSize: 13, color: '#6b7280' }}>
              Log in to the admin dashboard to view the full submission.
            </Text>
          </Section>

          <Hr style={{ borderColor: '#e5e7eb', margin: '0 40px' }} />

          <Section style={{ padding: '24px 40px' }}>
            <Text style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
              Al-Hayaat School — Internal notification. Do not reply to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
