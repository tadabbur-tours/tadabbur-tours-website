'use client';

import { TESTIMONIALS } from '@/config/site';

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-stone-700 to-stone-800 bg-clip-text text-transparent">
            Here&apos;s What Our Attendees Say
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-stone-400 to-stone-600 mx-auto rounded-full" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-stone-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-yellow-400 text-lg mb-3">{'★'.repeat(testimonial.stars)}</div>
              <p className="text-stone-700 mb-4 leading-relaxed">{testimonial.text}</p>
              <div className="text-stone-600 font-semibold">{testimonial.author}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
