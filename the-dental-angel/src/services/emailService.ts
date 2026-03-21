/**
 * Email Service
 *
 * Sends transactional emails via Resend (https://resend.com).
 * Used for Expert Review notifications to Dr. Angel.
 *
 * Setup: Add your Resend API key to .env.local as EXPO_PUBLIC_RESEND_API_KEY
 * If no key is configured, emails are logged to console as a fallback.
 */

const RESEND_API_KEY = process.env.EXPO_PUBLIC_RESEND_API_KEY;
const RESEND_API_URL = 'https://api.resend.com/emails';

/** Default sender — uses Resend's onboarding domain until a custom domain is verified */
const DEFAULT_FROM = 'The Dental Angel <onboarding@resend.dev>';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email via Resend.
 * Returns true if sent successfully, false otherwise.
 * Falls back to console logging if API key is not configured.
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log('[EmailService] No API key configured — logging email instead:');
    console.log(`  To: ${options.to}`);
    console.log(`  Subject: ${options.subject}`);
    console.log(`  Body: ${options.html.substring(0, 200)}...`);
    return false;
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: DEFAULT_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[EmailService] Failed to send email:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[EmailService] Error sending email:', error);
    return false;
  }
}

/** Check whether email sending is configured */
export function isEmailConfigured(): boolean {
  return !!RESEND_API_KEY;
}
