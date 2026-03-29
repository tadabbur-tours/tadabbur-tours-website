'use client';

import { useState, useEffect } from 'react';
import { BookingModalProvider } from '@/contexts';
import { Header } from '@/components/layout';
import {
  HeroSection,
  PackagesSection,
  TestimonialsSection,
  AboutSection,
  TafSeerahSection,
  GallerySection,
  ContactSection,
} from '@/components/sections';

const NAVBAR_OFFSET = 80;
const SCROLL_PADDING = 20;

export default function Home() {
  const [floatingCtaVisible, setFloatingCtaVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const packagesSection = document.getElementById('packages');
      if (packagesSection) {
        const rect = packagesSection.getBoundingClientRect();
        setFloatingCtaVisible(rect.bottom < 0);
      }
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById(sectionId);
    if (element) {
      const top = element.offsetTop - NAVBAR_OFFSET - SCROLL_PADDING;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <BookingModalProvider>
      <div className="min-h-screen bg-white">
        <Header
          isScrolled={isScrolled}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={() => setIsMobileMenuOpen((v) => !v)}
          onNavigate={scrollToSection}
        />

        <HeroSection onScrollToSection={scrollToSection} />

        <PackagesSection onScrollToSection={scrollToSection} />

        <TestimonialsSection />

        <AboutSection />

        <TafSeerahSection />

        <GallerySection />

        <ContactSection />

        {floatingCtaVisible && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <button
              onClick={() => scrollToSection('packages')}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
            >
              View Packages
            </button>
          </div>
        )}
      </div>
    </BookingModalProvider>
  );
}
