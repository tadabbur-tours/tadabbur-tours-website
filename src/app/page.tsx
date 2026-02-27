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
import { GALLERY_SLIDES, SACRED_SITES } from '@/config/site';

const NAVBAR_OFFSET = 80;
const SCROLL_PADDING = 20;

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSacredSite, setCurrentSacredSite] = useState(0);
  const [floatingCtaVisible, setFloatingCtaVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % GALLERY_SLIDES.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentSacredSite((prev) => (prev + 1) % SACRED_SITES.length),
      6000
    );
    return () => clearInterval(interval);
  }, []);

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

  const changeSlide = (direction: number) => {
    setCurrentSlide((prev) => {
      const next = prev + direction;
      if (next < 0) return GALLERY_SLIDES.length - 1;
      if (next >= GALLERY_SLIDES.length) return 0;
      return next;
    });
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

        <TafSeerahSection
          currentSacredSite={currentSacredSite}
          onPrevSacredSite={() =>
            setCurrentSacredSite((prev) => (prev - 1 + SACRED_SITES.length) % SACRED_SITES.length)
          }
          onNextSacredSite={() => setCurrentSacredSite((prev) => (prev + 1) % SACRED_SITES.length)}
          onGoToSacredSite={setCurrentSacredSite}
        />

        <GallerySection
          currentSlide={currentSlide}
          onChangeSlide={changeSlide}
          onGoToSlide={setCurrentSlide}
        />

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
