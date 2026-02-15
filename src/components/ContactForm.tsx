'use client';

import { useState, useCallback } from 'react';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
  company: string; // honeypot
}

const initialFormState: FormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
  company: '',
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const update = useCallback((field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage(null);
    }
  }, [status]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatus('loading');
      setErrorMessage(null);

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim() || undefined,
            message: form.message.trim(),
            company: form.company, // honeypot
          }),
        });

        const data = (await res.json()) as { success?: boolean; message?: string };

        if (!res.ok) {
          setStatus('error');
          setErrorMessage(data.message ?? 'Something went wrong. Please try again.');
          return;
        }

        if (data.success) {
          setStatus('success');
          setForm(initialFormState);
        } else {
          setStatus('error');
          setErrorMessage(data.message ?? 'Something went wrong. Please try again.');
        }
      } catch {
        setStatus('error');
        setErrorMessage('Network error. Please try again or email us directly.');
      }
    },
    [form]
  );

  const isLoading = status === 'loading';

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-stone-200/50">
      <h3 className="text-2xl font-bold text-stone-800 mb-8">Send us a Message</h3>

      <form onSubmit={handleSubmit} noValidate aria-describedby="contact-status">
        {/* Honeypot: hidden from users, visible to bots. Do not use type="hidden" so bots that ignore hidden fields still fill it. */}
        <div className="absolute -left-[9999px] top-0 w-1 h-1 overflow-hidden" aria-hidden="true">
          <label htmlFor="contact-company">Company</label>
          <input
            type="text"
            id="contact-company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={(e) => update('company', e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-semibold text-stone-600 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="contact-name"
              name="name"
              required
              maxLength={120}
              autoComplete="name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors text-stone-900 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-invalid={status === 'error' && !form.name.trim()}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-semibold text-stone-600 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="contact-email"
              name="email"
              required
              maxLength={254}
              autoComplete="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors text-stone-900 disabled:opacity-60 disabled:cursor-not-allowed"
              aria-invalid={status === 'error' && !form.email.trim()}
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="contact-phone" className="block text-sm font-semibold text-stone-600 mb-1">
            Phone <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            id="contact-phone"
            name="phone"
            maxLength={30}
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors text-stone-900 disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="contact-message" className="block text-sm font-semibold text-stone-600 mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={4}
            minLength={10}
            maxLength={5000}
            value={form.message}
            onChange={(e) => update('message', e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors resize-none text-stone-900 disabled:opacity-60 disabled:cursor-not-allowed"
            aria-invalid={status === 'error' && form.message.trim().length < 10}
          />
          <p className="mt-1 text-xs text-stone-500">
            At least 10 characters, max 5,000.
          </p>
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-stone-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>

          <div id="contact-status" role="status" aria-live="polite">
            {status === 'success' && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Thank you. We will get back to you shortly.
              </div>
            )}
            {status === 'error' && errorMessage && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
