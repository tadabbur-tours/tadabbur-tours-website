'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BookingModal from '@/components/BookingModal';
import InquiryModal from '@/components/InquiryModal';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSacredSite, setCurrentSacredSite] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<{
    packageId: string;
    packageName: string;
    price: string;
    dates: string;
    duration: string;
  }>({
    packageId: '',
    packageName: '',
    price: '',
    dates: '',
    duration: ''
  });
  const [floatingCtaVisible, setFloatingCtaVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const slides = [
    'gallery-1.JPG',
    'gallery-2.JPG', 
    'gallery-3.JPG',
    'gallery-4.JPG',
    'gallery-5.jpg',
    'gallery-6.jpg'
  ];

  const sacredSites = [
    {
      name: 'Makkah',
      image: 'makkah.jpg',
      description: 'Experience the spiritual center of Islam. Perform Umrah at the Ka\'aba and walk in the footsteps of Prophet Ibrahim (AS).'
    },
    {
      name: 'Jabal Nur',
      image: 'jabal-nur.jpg',
      description: 'Stand at the Cave of Hira where the first revelation "Iqra" descended upon Prophet Muhammad (SAW).'
    },
    {
      name: 'Madinah',
      image: 'madinah.jpg',
      description: 'Visit the Prophet\'s Mosque and experience the blessed Rawdah, a piece of Jannah on earth.'
    },
    {
      name: 'Mount Uhud',
      image: 'uhud.jpg',
      description: 'Reflect on the lessons of the Battle of Uhud and visit the graves of the martyrs including Hamza (RA).'
    },
    {
      name: 'Badr',
      image: 'badr.jpg',
      description: 'Walk the battlefield where 313 believers faced impossible odds with divine assistance.'
    },
    {
      name: 'Ta\'if',
      image: 'taif.jpg',
      description: 'Trace the difficult journey of the Prophet (SAW) and understand his perseverance in the face of rejection.'
    }
  ];

  const packages = [
    {
      id: 'january',
      name: 'January Umrah',
      price: '$3,300',
      duration: '10 days',
      dates: 'January 7-18, 2026',
      status: 'sold-out',
      soldOut: true
    },
    {
      id: 'december',
      name: 'December Umrah',
      price: '$3,750',
      duration: '12 days',
      dates: 'December 20-31, 2026',
      status: 'standard',
      soldOut: false
    },
    {
      id: 'august',
      name: 'August Umrah',
      price: '$3,300',
      duration: '10 days',
      dates: 'August 5-15, 2027',
      status: 'inquiry',
      soldOut: false
    }
  ];

  const testimonials = [
    {
      text: "I miss praying tahajjud at the rooftop and making dua in Masjid An-Nabawi.",
      author: "— Uzair A.",
      stars: 5
    },
    {
      text: "I don't think this trip will ever be outbeat.",
      author: "— Hanad A.",
      stars: 5
    },
    {
      text: "Wonderful itinerary and meaningful reflections. Highly recommend Tadabbur for a transformative Umrah.",
      author: "— Fatima R.",
      stars: 5
    },
    {
      text: "Professional team, inspiring sessions, and smooth logistics. It exceeded my expectations.",
      author: "— Muhammad A.",
      stars: 5
    }
  ];

  // Auto-play slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Auto-play sacred sites carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSacredSite((prev) => (prev + 1) % sacredSites.length);
    }, 6000); // 6 seconds per site
    return () => clearInterval(interval);
  }, [sacredSites.length]);

  // Floating CTA visibility and scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const packagesSection = document.getElementById('packages');
      if (packagesSection) {
        const rect = packagesSection.getBoundingClientRect();
        setFloatingCtaVisible(rect.bottom < 0);
      }
      
      // Check if scrolled for navbar effect
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeSlide = (direction: number) => {
    setCurrentSlide((prev) => {
      const newSlide = prev + direction;
      if (newSlide < 0) return slides.length - 1;
      if (newSlide >= slides.length) return 0;
      return newSlide;
    });
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSacredSite = () => {
    setCurrentSacredSite((prev) => (prev + 1) % sacredSites.length);
  };

  const prevSacredSite = () => {
    setCurrentSacredSite((prev) => (prev - 1 + sacredSites.length) % sacredSites.length);
  };

  const goToSacredSite = (index: number) => {
    setCurrentSacredSite(index);
  };

  const openBookingModal = (packageId: string, packageName: string, price: string, dates: string, duration: string) => {
    setBookingData({ packageId, packageName, price, dates, duration });
    setIsBookingModalOpen(true);
  };

  const openInquiryModal = (packageId: string, packageName: string, price: string, dates: string, duration: string) => {
    setBookingData({ packageId, packageName, price, dates, duration });
    setIsInquiryModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setBookingData({
      packageId: '',
      packageName: '',
      price: '',
      dates: '',
      duration: ''
    });
  };

  const closeInquiryModal = () => {
    setIsInquiryModalOpen(false);
    setBookingData({
      packageId: '',
      packageName: '',
      price: '',
      dates: '',
      duration: ''
    });
  };


  // Smooth scroll with navbar offset
  const scrollToSection = (sectionId: string) => {
    // Ensure we're in the browser environment
    if (typeof window === 'undefined') return;
    
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // h-20 = 80px
      const elementPosition = element.offsetTop - navbarHeight - 20; // Extra 20px padding
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="#" className="flex items-center group">
              <Image 
                src="/logo.png" 
                alt="Tadabbur Logo" 
                width={isScrolled ? 80 : 100} 
                height={isScrolled ? 80 : 100} 
                className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{ width: 'auto', height: 'auto' }}
              />
              {isScrolled && (
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                  Tadabbur Tours
                </span>
              )}
            </Link>
            
            {/* Desktop Menu */}
            <ul className="hidden lg:flex space-x-8">
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className={`relative px-4 py-2 font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled ? 'text-gray-700 hover:text-amber-600' : 'text-white hover:text-amber-200'
                  }`}
                >
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 hover:w-full"></span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('taf-seerah')}
                  className={`relative px-4 py-2 font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled ? 'text-gray-700 hover:text-amber-600' : 'text-white hover:text-amber-200'
                  }`}
                >
                  Taf-Seerah Umrah
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 hover:w-full"></span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('gallery')}
                  className={`relative px-4 py-2 font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled ? 'text-gray-700 hover:text-amber-600' : 'text-white hover:text-amber-200'
                  }`}
                >
                  Gallery
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 hover:w-full"></span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="relative px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
                >
                  Contact Us
                </button>
              </li>
            </ul>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden relative w-8 h-8 flex flex-col justify-center items-center transition-all duration-300 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              <span className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-current mt-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-current mt-1 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="py-4 space-y-4 bg-white/95 backdrop-blur-md rounded-2xl mt-4 shadow-xl border border-gray-200">
              <button 
                onClick={() => {
                  scrollToSection('about');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-6 py-3 text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300"
              >
                About
              </button>
              <button 
                onClick={() => {
                  scrollToSection('taf-seerah');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-6 py-3 text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300"
              >
                Taf-Seerah Umrah
              </button>
              <button 
                onClick={() => {
                  scrollToSection('gallery');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-6 py-3 text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300"
              >
                Gallery
              </button>
              <button 
                onClick={() => {
                  scrollToSection('contact');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full px-6 py-3 mx-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full text-center font-semibold hover:shadow-lg transition-all duration-300"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/hero-background.jpg')] bg-cover bg-center bg-no-repeat"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
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
                onClick={() => scrollToSection('taf-seerah')}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-stone-800 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                Discover the Journey
              </button>
              <button 
                onClick={() => scrollToSection('packages')}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-stone-800 rounded-full font-semibold text-lg hover:bg-stone-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                View Packages
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-24 bg-gradient-to-br from-stone-100 via-neutral-50 to-stone-100 text-stone-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-600 bg-clip-text text-transparent">
              Taf-Seerah Trips
            </h2>
            <div className="w-40 h-1 bg-gradient-to-r from-stone-400 via-stone-500 to-stone-600 mx-auto rounded-full mb-6"></div>
            <p className="text-xl md:text-2xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
              Transformative spiritual journeys that connect you with the essence of Islam
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {packages.map((pkg, index) => (
              <div 
                key={pkg.id} 
                className={`group relative bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-stone-200 hover:border-stone-300 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${
                  pkg.soldOut ? 'opacity-75' : 'hover:bg-white/90'
                } ${pkg.status === 'premium' ? 'ring-2 ring-stone-400/50' : ''}`}
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                {/* Premium Badge */}
                {pkg.status === 'premium' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-stone-600 via-stone-700 to-stone-800 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      ⭐ Premium Package
                    </div>
                  </div>
                )}

                {/* Sold Out Overlay */}
                {pkg.soldOut && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🔒</div>
                      <div className="text-xl font-bold text-red-300">Fully Booked</div>
                    </div>
                  </div>
                )}

                <div className="text-center relative z-0">
                  {/* Package Icon */}
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-stone-200/50 to-stone-300/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🕋</span>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-stone-800 group-hover:text-stone-700 transition-colors duration-300">
                    {pkg.name}
                  </h3>
                  
                  <div className="text-4xl lg:text-5xl font-bold text-stone-700 mb-6 group-hover:text-stone-600 transition-colors duration-300">
                    {pkg.price}
                  </div>
                  
                  <div className="space-y-3 text-stone-600 mb-8">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-stone-500">📅</span>
                      <span><strong>Duration:</strong> {pkg.duration}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-stone-500">🗓️</span>
                      <span><strong>Dates:</strong> {pkg.dates}</span>
                    </div>
                    {!pkg.soldOut && (
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-stone-500">✨</span>
                        <span className="text-sm">Premium accommodations & guided tours</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      if (pkg.soldOut) return null;
                      if (pkg.status === 'inquiry') {
                        openInquiryModal(pkg.id, pkg.name, pkg.price, pkg.dates, pkg.duration);
                      } else {
                        openBookingModal(pkg.id, pkg.name, pkg.price, pkg.dates, pkg.duration);
                      }
                    }}
                    disabled={pkg.soldOut}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                    pkg.soldOut 
                      ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed' 
                      : pkg.status === 'inquiry'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105 hover:-translate-y-1 text-white rounded-full'
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 hover:shadow-xl hover:scale-105 hover:-translate-y-1 text-white rounded-full'
                  }`}
                  >
                    {pkg.soldOut ? 'Sold Out' : pkg.status === 'inquiry' ? 'Inquire Now' : 'Book Now'}
                  </button>
                </div>

                {/* Hover Effect Glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-stone-400/0 via-stone-500/0 to-stone-600/0 group-hover:from-stone-400/10 group-hover:via-stone-500/10 group-hover:to-stone-600/10 transition-all duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-xl text-stone-600 mb-6">Ready to begin your spiritual journey?</p>
            <button 
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-stone-600 to-stone-700 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="mr-2"></span>
              Contact Us Today
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-stone-700 to-stone-800 bg-clip-text text-transparent">
              What Our Travelers Say
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-stone-400 to-stone-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-yellow-400 text-lg mb-3">
                  {'★'.repeat(testimonial.stars)}
                </div>
                <p className="text-stone-700 mb-4 leading-relaxed">{testimonial.text}</p>
                <div className="text-stone-600 font-semibold">{testimonial.author}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-stone-700 to-stone-800 bg-clip-text text-transparent">
              About Tadabbur Tours
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-stone-400 to-stone-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-6 text-lg text-stone-700 leading-relaxed">
              <p>Experience Umrah in a way that transcends the ordinary. Join Tadabbur Tours on an unforgettable journey to the sacred lands where the Qur&apos;an was revealed.</p>
              <p>This isn&apos;t just a pilgrimage; it&apos;s an opportunity to reconnect with the essence of your faith, immerse yourself in the teachings of the Qur&apos;an, and walk in the footsteps of the Prophet Muhammad (SAW).</p>
              <p>Our unique approach focuses on studying the Qur&apos;an in the very land where it was revealed, allowing you to absorb its meanings and significance like never before. Through detailed reflections on the Seerah, you&apos;ll gain insights that will enrich your spiritual experience.</p>
              <p>Don&apos;t miss this opportunity to embark on a journey that could transform your life. Spaces are limited.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Taf-Seerah Section */}
      <section id="taf-seerah" className="py-20 bg-gradient-to-br from-stone-200 to-stone-100 text-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-stone-800 to-stone-700 bg-clip-text text-transparent">
              Taf-Seerah Umrah
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-stone-400 to-stone-600 mx-auto rounded-full"></div>
          </div>
          
          {/* What We Offer */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">What We Offer</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: '📖', title: 'Deepen Your Connection with the Qur\'an', desc: 'Study the Qur\'an in the very land where it was revealed, allowing you to absorb its meanings and significance like never before.' },
                { icon: '🕌', title: 'Learn from the Seerah', desc: 'Let the life and teachings of the Prophet Muhammad (SAW) guide your journey through detailed reflections that enrich your experience.' },
                { icon: '🤲', title: 'Personalized Spiritual Guidance', desc: 'Our knowledgeable guides are with you every step of the way, offering personalized support and spiritual insights.' },
                { icon: '✨', title: 'Reflect and Revitalize', desc: 'Away from the hustle and bustle, reflect deeply, reconnect with your faith, and return home spiritually revitalized.' }
              ].map((feature, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-stone-200 hover:shadow-xl transition-all">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-bold mb-3 text-stone-800">{feature.title}</h4>
                  <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-center text-stone-800">What&apos;s Included</h3>
            <p className="text-center text-stone-600 mb-12">Everything you need for a complete spiritual journey</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: '✈️', title: 'Travel & Accommodation', items: ['Airfare', '5-Star Hotels', 'Visa Processing'] },
                { icon: '🕌', title: 'Spiritual Experience', items: ['Guided Ziyarat', 'Rawdah Experience', 'Jummah Prayers'] },
                { icon: '📚', title: 'Learning & Guidance', items: ['Umrah Guidebook', 'Tadabbur Circles', 'Spiritual Guidance'] },
                { icon: '🍽️', title: 'Meals & Transportation', items: ['Transportation', 'Daily Breakfast', 'Ihram'] }
              ].map((category, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-stone-200">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">{category.icon}</span>
                    <h4 className="text-xl font-bold text-stone-800">{category.title}</h4>
                  </div>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="text-stone-600">
                        <h5 className="font-semibold text-stone-800">{item}</h5>
                        <p className="text-sm text-stone-500">Comprehensive service included</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-stone-700 to-stone-800 bg-clip-text text-transparent">
            Sacred Sites We Visit
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-stone-400 to-stone-600 mx-auto rounded-full"></div>
          </div>
          
          {/* Sacred Sites Carousel */}
          <div className="mb-16">
            <div className="relative max-w-5xl mx-auto">
              {/* Main Sacred Site Card */}
              <div className="relative">
                <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xl">
                  <div className="relative h-80 md:h-96">
                    <Image 
                      src={`/${sacredSites[currentSacredSite].image}`} 
                      alt={sacredSites[currentSacredSite].name} 
                      fill 
                      className="object-cover transition-all duration-500" 
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h4 className="text-3xl md:text-4xl font-bold mb-3">{sacredSites[currentSacredSite].name}</h4>
                      <p className="text-lg leading-relaxed text-white/95">{sacredSites[currentSacredSite].description}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSacredSite}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Previous sacred site"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSacredSite}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Next sacred site"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Indicator Dots */}
              <div className="flex justify-center gap-3 mt-8">
                {sacredSites.map((site, index) => (
                  <button
                    key={index}
                    onClick={() => goToSacredSite(index)}
                    className={`transition-all duration-300 ${
                      currentSacredSite === index 
                        ? 'w-12 h-3 bg-gradient-to-r from-stone-600 to-stone-700 rounded-full' 
                        : 'w-3 h-3 bg-stone-300 hover:bg-stone-400 rounded-full'
                    }`}
                    aria-label={`Go to ${site.name}`}
                  />
                ))}
              </div>

              {/* Site Counter */}
              <div className="text-center mt-6">
                <p className="text-stone-600 font-medium">
                  {currentSacredSite + 1} of {sacredSites.length} Sacred Sites
                </p>
              </div>
            </div>
          </div>

          {/* Photo Gallery Slideshow */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-12 text-center text-stone-800">Our Journey Gallery</h3>
            <div className="relative max-w-6xl mx-auto">
              <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer" onClick={() => setLightboxImage(slides[currentSlide])}>
                <Image 
                  src={`/${slides[currentSlide]}`} 
                  alt={`Gallery Image ${currentSlide + 1}`} 
                  fill 
                  className="object-cover transition-all duration-700 group-hover:scale-105" 
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                      <span className="text-2xl">🔍</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation arrows */}
              <button 
                onClick={() => changeSlide(-1)}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
              >
                <span className="text-xl">‹</span>
              </button>
              <button 
                onClick={() => changeSlide(1)}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
              >
                <span className="text-xl">›</span>
              </button>
              
              {/* Dots indicator */}
              <div className="flex justify-center mt-8 space-x-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-gradient-to-r from-stone-500 to-stone-600 scale-125' 
                        : 'bg-stone-300 hover:bg-stone-400 hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-12 max-w-4xl mx-auto">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    index === currentSlide 
                      ? 'ring-4 ring-stone-500 scale-105' 
                      : 'hover:scale-105 hover:ring-2 hover:ring-stone-300'
                  }`}
                >
                  <Image 
                    src={`/${slide}`} 
                    alt={`Thumbnail ${index + 1}`} 
                    fill 
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    className="object-cover" 
                  />
                </div>
              ))}
            </div>
            
            {/* Flickr Link */}
            <div className="text-center mt-12">
              <p className="text-stone-600 mb-6 text-lg">Experience the beauty and spirituality of our sacred journeys through our comprehensive photo collection.</p>
              <a 
                href="https://flic.kr/s/aHBqjC18Bk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gradient-to-r from-stone-600 via-stone-700 to-stone-800 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="mr-3 text-xl">📸</span>
                View Full Gallery on Flickr
                <span className="ml-3 text-lg">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-br from-stone-50 via-neutral-50 to-stone-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f59e0b' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-stone-700 via-stone-800 to-stone-900 bg-clip-text text-transparent">
              Contact Us
            </h2>
            <div className="w-40 h-1 bg-gradient-to-r from-stone-400 via-stone-500 to-stone-600 mx-auto rounded-full mb-6"></div>
            <p className="text-xl md:text-2xl text-stone-700 max-w-3xl mx-auto leading-relaxed">
              Ready to embark on your spiritual journey? Get in touch with us today and let&apos;s make your dream Umrah a reality.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-stone-800 mb-8">Get in Touch</h3>
              <div className="space-y-8">
                {[
                  { icon: '📧', title: 'Email', info: 'info@tadabburtours.com', description: 'Send us your questions anytime' },
                  { icon: '🌐', title: 'Website', info: 'ask.tadabburtours.com', description: 'Visit our knowledge base' },
                  { icon: '📱', title: 'Phone', info: '+1 (555) 123-4567', description: 'Call us for immediate assistance' }
                ].map((contact, index) => (
                  <div key={index} className="group flex items-start p-6 bg-white/60 backdrop-blur-sm rounded-2xl hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="text-3xl mr-6 group-hover:scale-110 transition-transform duration-300">{contact.icon}</div>
                    <div>
                      <h4 className="font-bold text-stone-800 text-lg mb-1">{contact.title}</h4>
                      <p className="text-stone-700 font-semibold text-lg mb-1">{contact.info}</p>
                      <p className="text-stone-600">{contact.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <form className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-stone-200/50">
                <h3 className="text-2xl font-bold text-stone-800 mb-8">Send us a Message</h3>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="relative">
                    <input 
                      type="text" 
                      id="fullName"
                      className="w-full px-4 py-4 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all duration-300 peer text-gray-900" 
                      placeholder=" "
                    />
                    <label 
                      htmlFor="fullName"
                      className="absolute left-4 -top-2 bg-white px-2 text-sm font-semibold text-stone-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-stone-400 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-stone-600 transition-all duration-300"
                    >
                      Full Name
                    </label>
                  </div>
                  <div className="relative">
                    <input 
                      type="email" 
                      id="email"
                      className="w-full px-4 py-4 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all duration-300 peer text-gray-900" 
                      placeholder=" "
                    />
                    <label 
                      htmlFor="email"
                      className="absolute left-4 -top-2 bg-white px-2 text-sm font-semibold text-stone-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-stone-400 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-stone-600 transition-all duration-300"
                    >
                      Email Address
                    </label>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="relative">
                    <input 
                      type="tel" 
                      id="phone"
                      className="w-full px-4 py-4 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all duration-300 peer text-gray-900" 
                      placeholder=" "
                    />
                    <label 
                      htmlFor="phone"
                      className="absolute left-4 -top-2 bg-white px-2 text-sm font-semibold text-stone-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-stone-400 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-stone-600 transition-all duration-300"
                    >
                      Phone Number
                    </label>
                  </div>
                  <div className="relative">
                    <select 
                      id="package"
                      className="w-full px-4 py-4 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all duration-300 appearance-none bg-white"
                    >
                      <option value="">Select a package</option>
                      <option value="december">December Umrah - $3,700</option>
                      <option value="august">August Umrah - $3,300</option>
                    </select>
                    <label 
                      htmlFor="package"
                      className="absolute left-4 -top-2 bg-white px-2 text-sm font-semibold text-stone-600"
                    >
                      Package Interest
                    </label>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="relative">
                    <textarea 
                      id="message"
                      rows={4} 
                      className="w-full px-4 py-4 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-all duration-300 peer resize-none text-gray-900" 
                      placeholder=" "
                    />
                    <label 
                      htmlFor="message"
                      className="absolute left-4 -top-2 bg-white px-2 text-sm font-semibold text-stone-600 peer-placeholder-shown:text-base peer-placeholder-shown:text-stone-400 peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-stone-600 transition-all duration-300"
                    >
                      Tell us about your spiritual journey goals...
                    </label>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-stone-600 via-stone-700 to-stone-800 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <span className="mr-2">📤</span>
                    Send Message
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-700 via-stone-800 to-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-amber-400 transition-colors duration-300"
            >
              ✕
            </button>
            <Image
              src={`/${lightboxImage}`}
              alt="Gallery Image"
              width={1200}
              height={800}
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Floating CTA */}
      {floatingCtaVisible && (
        <button
          onClick={() => {
            // Open booking modal with December Umrah package
            const decemberPackage = packages.find(pkg => pkg.id === 'december');
            if (decemberPackage) {
              openBookingModal(
                decemberPackage.id,
                decemberPackage.name,
                decemberPackage.price,
                decemberPackage.dates,
                decemberPackage.duration
              );
            }
          }}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 z-40 animate-pulse"
        >
          <span className="flex items-center">
            <span className="mr-2">🚀</span>
            Book Now
          </span>
        </button>
      )}

      {/* Footer */}
      <footer className="bg-stone-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Tadabbur. All rights reserved.</p>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        packageData={bookingData}
      />

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryModalOpen}
        onClose={closeInquiryModal}
        packageData={bookingData}
      />
    </div>
  );
}