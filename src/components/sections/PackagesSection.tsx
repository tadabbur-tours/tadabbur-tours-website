'use client';

import Image from 'next/image';
import { PACKAGES } from '@/config/site';
import { useBookingModals } from '@/contexts';
import type { Package } from '@/lib/types';

interface PackagesSectionProps {
  onScrollToSection: (sectionId: string) => void;
}

function getPackageImage(pkgId: string): string {
  if (pkgId === 'january') return "url('/jan.png')";
  if (pkgId === 'august') return "url('/aug.png')";
  return "url('/Dec2026.png')";
}

export default function PackagesSection({ onScrollToSection }: PackagesSectionProps) {
  const { openBookingModal, openInquiryModal } = useBookingModals();
  return (
    <section id="packages" className="py-24 bg-gradient-to-br from-stone-100 via-neutral-50 to-stone-100 text-stone-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-stone-800 via-stone-700 to-stone-600 bg-clip-text text-transparent">
            Our Packages
          </h2>
          <div className="w-40 h-1 bg-gradient-to-r from-stone-400 via-stone-500 to-stone-600 mx-auto rounded-full mb-6" />
          <p className="text-xl md:text-2xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Our flagship trip isn&apos;t just about visiting sacred places, it&apos;s about living the story of the Prophet (SAW) through the Qur&apos;an.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`group relative backdrop-blur-md rounded-3xl overflow-hidden border border-stone-200 hover:border-stone-300 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${
                pkg.id === 'january'
                  ? 'bg-white/50'
                  : pkg.soldOut
                    ? 'bg-white/80 opacity-75'
                    : 'bg-white/80 hover:bg-white/90'
              } ${pkg.status === 'premium' ? 'ring-2 ring-stone-400/50' : ''}`}
            >
              <div className="relative h-48 bg-gradient-to-br from-sky-200 via-blue-100 to-gray-100 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-70"
                  style={{ backgroundImage: getPackageImage(pkg.id) }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
              </div>

              <div className="p-8">
                {pkg.status === 'premium' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-stone-600 via-stone-700 to-stone-800 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      ⭐ Premium Package
                    </div>
                  </div>
                )}

                {pkg.soldOut && (
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-md rounded-3xl flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🔒</div>
                      <div
                        className={`inline-block px-6 py-3 rounded-xl bg-red-100/90 border-2 border-red-300 shadow-lg ${pkg.id === 'january' ? 'text-red-600' : 'text-red-500'}`}
                      >
                        <span className="text-xl font-bold">Fully Booked</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center relative z-20">
                  <div className="mx-auto mb-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <span className="text-3xl font-bold tracking-wide text-stone-700">{pkg.name}</span>
                  </div>
                  <div
                    className={`text-4xl lg:text-5xl font-bold mb-6 transition-colors duration-300 ${
                      pkg.id === 'january' ? 'text-stone-300' : 'text-stone-700 group-hover:text-stone-600'
                    }`}
                  >
                    {pkg.price}
                  </div>
                  <div
                    className={`space-y-3 mb-8 ${pkg.id === 'january' ? 'text-stone-300' : 'text-stone-600'}`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-stone-500 text-lg flex-shrink-0 w-6 text-center">📅</span>
                      <span className="text-center"><strong>Duration:</strong> {pkg.duration}</span>
                    </div>
                    <div className="flex items-start justify-center gap-3">
                      <span className="text-stone-500 text-lg flex-shrink-0 w-6 text-center pt-0.5">🗓️</span>
                      <div className="text-center flex-1">
                        <strong>Dates:</strong> <span className="inline-block text-balance">{pkg.dates}</span>
                      </div>
                    </div>
                    {!pkg.soldOut && (
                      <div className="flex items-center justify-center">
                        <span className="text-sm text-center">A premium experience at a competitive price</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (pkg.soldOut) return;
                      if (pkg.status === 'inquiry') {
                        openInquiryModal(pkg);
                      } else {
                        openBookingModal(pkg);
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
              </div>

              <div
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-stone-400/0 via-stone-500/0 to-stone-600/0 group-hover:from-stone-400/10 group-hover:via-stone-500/10 group-hover:to-stone-600/10 transition-all duration-500 pointer-events-none z-0"
                aria-hidden
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-xl text-stone-600 mb-6">Wondering if this experience is right for you?</p>
          <button
            onClick={() => onScrollToSection('contact')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-stone-600 to-stone-700 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            Contact Us Today
          </button>
        </div>
      </div>
    </section>
  );
}
