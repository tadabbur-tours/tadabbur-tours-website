/**
 * Brevo (Transactional Email + Contacts) integration.
 * Uses raw fetch so request bodies match the API docs exactly. Server-only.
 */

function getApiKey(): string | null {
  return process.env.BREVO_API_KEY ?? null;
}

export function isBrevoConfigured(): boolean {
  return !!getApiKey();
}

export interface SendTransactionalEmailParams {
  to: { email: string; name?: string };
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: { email: string; name?: string };
}

/**
 * Send a transactional email via Brevo (same as the working curl / Brevo UI).
 * Returns messageId on success, throws on API error.
 */
export async function sendTransactionalEmail(
  params: SendTransactionalEmailParams
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured');
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? process.env.BREVO_FROM_EMAIL;
  if (!senderEmail) {
    throw new Error('BREVO_SENDER_EMAIL (or BREVO_FROM_EMAIL) is required to send email');
  }

  const payload = {
    sender: {
      name: process.env.BREVO_SENDER_NAME ?? 'Tadabbur Tours',
      email: senderEmail,
    },
    to: [{ email: params.to.email, name: params.to.name }],
    subject: params.subject,
    htmlContent: params.htmlContent,
    ...(params.textContent && { textContent: params.textContent }),
    ...(params.replyTo && {
      replyTo: { email: params.replyTo.email, name: params.replyTo.name },
    }),
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  console.log('Brevo status:', response.status);
  console.log('Brevo response:', text);

  if (!response.ok) {
    throw new Error(`Brevo send failed: ${response.status} ${text}`);
  }

  let messageId = '';
  try {
    const data = JSON.parse(text) as { messageId?: string };
    messageId = data.messageId ?? '';
  } catch {
    // ignore
  }
  return messageId;
}

export interface AddContactParams {
  email: string;
  name?: string;
  phone?: string;
  listIds: number[];
}

/**
 * Create or update contact and add to list(s) in one call — same payload as working example.
 * POST /v3/contacts with { email, updateEnabled: true, listIds }.
 */
export async function addContactToList(params: AddContactParams): Promise<void> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured');
  }

  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      email: params.email,
      updateEnabled: true,
      listIds: params.listIds,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Brevo createContact failed: ${res.status} ${errText}`);
  }
}
