import { NextRequest, NextResponse } from 'next/server';
import {
  sendTransactionalEmail,
  addContactToList,
  isBrevoConfigured,
} from '@/lib/brevo';

// --- Validation constants
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 5000;
const NAME_MAX_LENGTH = 120;
const EMAIL_MAX_LENGTH = 254;
const PHONE_MAX_LENGTH = 30;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 request per minute per IP

// --- In-memory rate limit: IP -> last request timestamp
const rateLimitMap = new Map<string, number>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const last = rateLimitMap.get(ip);
  if (last != null && now - last < RATE_LIMIT_WINDOW_MS) {
    return true;
  }
  rateLimitMap.set(ip, now);
  // Prune old entries to avoid unbounded growth
  if (rateLimitMap.size > 10_000) {
    const cutoff = now - RATE_LIMIT_WINDOW_MS;
    for (const [k, v] of rateLimitMap.entries()) {
      if (v < cutoff) rateLimitMap.delete(k);
    }
  }
  return false;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeString(value: unknown, maxLength: number): string {
  if (value == null || typeof value !== 'string') return '';
  return value.slice(0, maxLength).replace(/[\0-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

export interface ContactRequestBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  company?: unknown; // honeypot
}

function validateBody(body: ContactRequestBody): { ok: true; data: { name: string; email: string; phone: string; message: string } } | { ok: false; status: number; message: string } {
  const name = sanitizeString(body.name, NAME_MAX_LENGTH).trim();
  const email = sanitizeString(body.email, EMAIL_MAX_LENGTH).trim().toLowerCase();
  const phone = sanitizeString(body.phone, PHONE_MAX_LENGTH).trim();
  const message = sanitizeString(body.message, MESSAGE_MAX_LENGTH).trim();

  if (!name) {
    return { ok: false, status: 400, message: 'Name is required.' };
  }
  if (!email) {
    return { ok: false, status: 400, message: 'Email is required.' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, status: 400, message: 'Please provide a valid email address.' };
  }
  if (message.length < MESSAGE_MIN_LENGTH) {
    return { ok: false, status: 400, message: `Message must be at least ${MESSAGE_MIN_LENGTH} characters.` };
  }
  if (message.length > MESSAGE_MAX_LENGTH) {
    return { ok: false, status: 400, message: `Message must be no more than ${MESSAGE_MAX_LENGTH} characters.` };
  }

  return { ok: true, data: { name, email, phone, message } };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ success: false, message: 'Method not allowed.' }, { status: 405 });
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again in a minute.' },
      { status: 429 }
    );
  }

  let body: ContactRequestBody;
  try {
    body = (await request.json()) as ContactRequestBody;
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body.' },
      { status: 400 }
    );
  }

  // Honeypot: if "company" is filled, pretend success and do nothing
  const honeypot = typeof body.company === 'string' ? body.company.trim() : '';
  if (honeypot.length > 0) {
    return NextResponse.json({ success: true, message: 'Thank you. We will get back to you shortly.' });
  }

  const validated = validateBody(body);
  if (!validated.ok) {
    return NextResponse.json(
      { success: false, message: validated.message },
      { status: validated.status }
    );
  }

  const { name, email, phone, message } = validated.data;

  if (!isBrevoConfigured()) {
    return NextResponse.json(
      { success: false, message: 'Contact form is not configured. Please try again later or email us directly.' },
      { status: 503 }
    );
  }

  const businessEmail = process.env.CONTACT_BUSINESS_EMAIL ?? process.env.ADMIN_EMAIL ?? '';
  const listIdRaw = process.env.BREVO_LIST_ID;
  const listIds = listIdRaw ? [parseInt(listIdRaw, 10)].filter((n) => !Number.isNaN(n) && n > 0) : [];

  try {
    // 1. Notification email to business
    if (businessEmail) {
      const businessHtml = `
        <p><strong>New contact form submission</strong></p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${phone ? escapeHtml(phone) : '—'}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(message)}</pre>
      `;
      await sendTransactionalEmail({
        to: { email: businessEmail, name: 'Tadabbur Tours' },
        subject: `Contact form: ${name}`,
        htmlContent: businessHtml,
        textContent: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '—'}\n\nMessage:\n${message}`,
        replyTo: { email, name },
      });
    }

    // 2. Optional confirmation email to user
    const sendConfirmation = process.env.CONTACT_SEND_CONFIRMATION === 'true';
    if (sendConfirmation && businessEmail) {
      const confirmHtml = `
        <p>Hi ${escapeHtml(name)},</p>
        <p>We have received your message and will get back to you shortly.</p>
        <p>— Tadabbur Tours</p>
      `;
      await sendTransactionalEmail({
        to: { email, name },
        subject: "We've received your message | Tadabbur Tours",
        htmlContent: confirmHtml,
        textContent: `Hi ${name},\n\nWe have received your message and will get back to you shortly.\n\n— Tadabbur Tours`,
      });
    }

    // 3. Add contact to Brevo list (non-fatal: emails already sent)
    if (listIds.length > 0) {
      try {
        await addContactToList({ email, name, phone: phone || undefined, listIds });
        console.log('[contact] Added to list:', email, 'listIds:', listIds);
      } catch (listErr) {
        console.error('[contact] Add to list failed:', listErr instanceof Error ? listErr.message : listErr);
      }
    }
  } catch (err) {
    console.error('[contact] Send failed:', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, message: 'Failed to send your message. Please try again or email us directly.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Thank you. We will get back to you shortly.',
  });
}
