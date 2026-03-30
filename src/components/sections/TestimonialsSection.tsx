'use client';

import { TESTIMONIALS } from '@/config/site';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function TestimonialsSection() {
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const maxChars = 180;

  const getPreview = useMemo(() => {
    return (text: string) => {
      if (text.length <= maxChars) return text;
      return `${text.slice(0, maxChars).trimEnd()}...`;
    };
  }, [maxChars]);

  const active = modalIndex === null ? null : TESTIMONIALS[modalIndex];

  useEffect(() => {
    if (modalIndex === null) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus for keyboard users.
    const t = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, [modalIndex]);

  useEffect(() => {
    if (modalIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalIndex(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalIndex]);

  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-stone-700 to-stone-800 bg-clip-text text-transparent">
              Here&apos;s What Our Attendees Say
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-stone-400 to-stone-600 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TESTIMONIALS.map((testimonial, index) => {
              const isLong = testimonial.text.length > maxChars;
              return (
                <div
                  key={index}
                  className="bg-white border border-stone-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-yellow-400 text-lg mb-3">{'★'.repeat(testimonial.stars)}</div>
                  <p className="text-stone-700 mb-4 leading-relaxed">{getPreview(testimonial.text)}</p>

                  {isLong && (
                    <button
                      type="button"
                      className="mb-2 text-sm font-semibold text-stone-700 hover:text-stone-900 underline underline-offset-4"
                      onClick={() => setModalIndex(index)}
                    >
                      Read more
                    </button>
                  )}

                  <div className="text-stone-600 font-semibold">{testimonial.author}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimonial-modal-title"
          onMouseDown={(e) => {
            // Close only when clicking the backdrop.
            if (e.target === e.currentTarget) setModalIndex(null);
          }}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden shadow-xl border border-gray-100">
            <div className="flex items-start justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-stone-50 to-neutral-50">
              <div>
                <h3 id="testimonial-modal-title" className="text-2xl font-bold text-stone-900">
                  Attendee feedback
                </h3>
                <p className="text-stone-600 mt-1">{active.author}</p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setModalIndex(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Close testimonial modal"
              >
                <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="text-yellow-400 text-lg mb-4">{'★'.repeat(active.stars)}</div>
              <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{active.text}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
