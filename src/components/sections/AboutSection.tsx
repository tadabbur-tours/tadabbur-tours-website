'use client';

import Image from 'next/image';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-stone-700 to-stone-800 bg-clip-text text-transparent">
            About Tadabbur Tours
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-stone-400 to-stone-600 mx-auto rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/team.JPG"
              alt="Tadabbur Tours Team"
              width={1200}
              height={800}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="text-center space-y-6 text-lg text-stone-700 leading-relaxed">
            <p>
              Tadabbur Tours is a tour operator leading immersive Qur&apos;an-inspired journeys. Our flagship trip, the Taf-Seerah Umrah Experience, isn&apos;t just about visiting sacred places, it&apos;s about living the story of the Prophet (SAW) through the Qur&apos;an.
            </p>
            <p>
              We ensure that your journey with us starts before takeoff through prep sessions, guides, and reflections - and continues after you return, so the experience truly lasts. We handle all the details so you can focus on what truly matters: reflection, connection, and transformation.
            </p>
            <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent mt-8 pt-6 border-t border-stone-300">
              We don&apos;t just take you to Umrah. We take you through the Qur&apos;an.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
