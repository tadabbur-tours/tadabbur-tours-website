'use client';

import Image from 'next/image';

interface HeroSectionProps {
  onScrollToSection: (sectionId: string) => void;
}

export default function HeroSection({ onScrollToSection }: HeroSectionProps) {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/hero-background.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Image
              src="/logo1.png"
              alt="Tadabbur Logo"
              width={300}
              height={300}
              className="mx-auto drop-shadow-2xl hover:scale-110 transition-transform duration-500"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Tadabbur Tours
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 font-light leading-relaxed">
            Exploring the Depths of the Divine Miracle
          </p>
          <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-95">
            Experience the transformative journey of reflecting on Allah&apos;s words in the very lands where revelation shaped hearts and history
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => onScrollToSection('taf-seerah')}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-stone-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 w-full sm:w-auto min-w-[220px]"
            >
              Discover the Journey
            </button>
            <button
              onClick={() => onScrollToSection('packages')}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-stone-800 rounded-full font-semibold text-lg hover:bg-stone-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 w-full sm:w-auto min-w-[220px]"
            >
              View Packages
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
