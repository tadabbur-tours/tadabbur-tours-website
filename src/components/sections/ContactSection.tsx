'use client';

import ContactForm from '@/components/ContactForm';
import { CONTACT_ITEMS } from '@/config/site';

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-stone-50 via-neutral-50 to-stone-100 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f59e0b' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-stone-700 via-stone-800 to-stone-900 bg-clip-text text-transparent">
            Contact Us
          </h2>
          <div className="w-40 h-1 bg-gradient-to-r from-stone-400 via-stone-500 to-stone-600 mx-auto rounded-full mb-6" />
          <p className="text-xl md:text-2xl text-stone-700 max-w-3xl mx-auto leading-relaxed">
            Still have questions? Get in touch with us today - where we&apos;ll handle the details so you can focus on the experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-stone-800 mb-8">Get in Touch</h3>
            <div className="space-y-8">
              {CONTACT_ITEMS.map((contact, index) => (
                <div
                  key={index}
                  className={`group flex items-start p-6 bg-white/60 backdrop-blur-sm rounded-2xl hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${contact.link ? 'cursor-pointer' : ''}`}
                  onClick={contact.link ? () => window.open(contact.link, '_blank', 'noopener,noreferrer') : undefined}
                  role={contact.link ? 'button' : undefined}
                >
                  <div className="text-3xl mr-6 group-hover:scale-110 transition-transform duration-300">
                    {contact.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 text-lg mb-1">{contact.title}</h4>
                    {contact.link ? (
                      <a
                        href={contact.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-700 font-semibold text-lg mb-1 hover:text-amber-600 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {contact.info}
                      </a>
                    ) : (
                      <p className="text-stone-700 font-semibold text-lg mb-1">{contact.info}</p>
                    )}
                    <p className="text-stone-600">{contact.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
