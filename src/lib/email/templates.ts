import { render } from '@react-email/render';
import { sendMail } from './client';
import { ContactConfirmationEmail } from './templates/contact-confirmation';
import { AdminNotificationEmail } from './templates/admin-notification';
import { NewsletterConfirmationEmail } from './templates/newsletter-confirmation';
import { ApplicationConfirmationEmail } from './templates/application-confirmation';
import { JobApplicationConfirmationEmail } from './templates/job-application-confirmation';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? 'admin@alhayaat.ca';

//  Contact form 

export async function sendContactConfirmation(
  name: string,
  email: string,
  message: string
): Promise<void> {
  const html = await render(ContactConfirmationEmail({ name, message }));
  await sendMail({ to: email, subject: 'We received your message  Al-Hayaat School', html });
}

export async function sendAdminContactNotification(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<void> {
  const html = await render(
    AdminNotificationEmail({
      formType: 'Contact',
      name,
      email,
      details: subject
        ? { Subject: subject, Message: message.slice(0, 500) }
        : { Message: message.slice(0, 500) },
    })
  );
  await sendMail({ to: ADMIN_EMAIL, subject: `[Al-Hayaat] New contact message from ${name}`, html });
}

//  Newsletter ─

export async function sendNewsletterConfirmation(email: string): Promise<void> {
  const html = await render(NewsletterConfirmationEmail({ email }));
  await sendMail({ to: email, subject: 'Newsletter subscription confirmed  Al-Hayaat School', html });
}

//  Enrollment application ─

export async function sendApplicationConfirmation(
  guardianName: string,
  guardianEmail: string,
  studentName: string
): Promise<void> {
  const html = await render(ApplicationConfirmationEmail({ guardianName, studentName }));
  await sendMail({
    to: guardianEmail,
    subject: `Enrollment application received for ${studentName}  Al-Hayaat School`,
    html,
  });
}

export async function sendAdminApplicationNotification(
  guardianName: string,
  guardianEmail: string,
  studentName: string,
  appId: string
): Promise<void> {
  const html = await render(
    AdminNotificationEmail({
      formType: 'Enrollment Application',
      name: guardianName,
      email: guardianEmail,
      details: { 'Student Name': studentName, 'Application ID': appId },
    })
  );
  await sendMail({ to: ADMIN_EMAIL, subject: `[Al-Hayaat] New enrollment application  ${studentName}`, html });
}

//  Job application 

export async function sendJobApplicationConfirmation(
  name: string,
  email: string,
  position: string
): Promise<void> {
  const html = await render(JobApplicationConfirmationEmail({ name, position }));
  await sendMail({ to: email, subject: `Job application received  ${position}  Al-Hayaat School`, html });
}

export async function sendAdminJobApplicationNotification(
  name: string,
  email: string,
  position: string
): Promise<void> {
  const html = await render(
    AdminNotificationEmail({ formType: 'Job Application', name, email, details: { Position: position } })
  );
  await sendMail({ to: ADMIN_EMAIL, subject: `[Al-Hayaat] New job application  ${position} from ${name}`, html });
}
