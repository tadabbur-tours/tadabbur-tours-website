'use client';

import { PACKAGES } from '@/config/site';
import { useBookingModals } from '@/contexts';

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`group relative flex h-full min-h-0 flex-col backdrop-blur-md rounded-3xl overflow-hidden border border-stone-200 hover:border-stone-300 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${
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
                {pkg.soldOut && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/25 backdrop-blur-[2px]">
                    <div className="text-center px-3">
                      <div className="text-4xl mb-2">🔒</div>
                      <div
                        className={`inline-block px-6 py-3 rounded-xl bg-red-100/95 border-2 border-red-300 shadow-lg ${pkg.id === 'january' ? 'text-red-600' : 'text-red-500'}`}
                      >
                        <span className="text-xl font-bold">Fully Booked</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-8 pt-9">
                {pkg.status === 'premium' && (
                  <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 transform">
                    <div className="bg-gradient-to-r from-stone-600 via-stone-700 to-stone-800 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      ⭐ Premium Package
                    </div>
                  </div>
                )}

                <div className="flex min-h-0 flex-1 flex-col">
                  <h3 className="text-center text-2xl font-bold tracking-tight text-stone-800 transition-transform duration-300 group-hover:scale-[1.02] sm:text-3xl">
                    {pkg.name}
                  </h3>
                  <p
                    className={`mt-3 text-center text-3xl font-bold tabular-nums sm:text-4xl ${
                      pkg.soldOut ? 'text-stone-500' : 'text-stone-700 group-hover:text-stone-600'
                    }`}
                  >
                    {pkg.price}
                  </p>

                  <dl
                    className={`mt-6 w-full grid grid-cols-[2rem_1fr] gap-x-3 gap-y-4 text-left text-sm sm:text-base ${
                      pkg.soldOut ? 'text-stone-500' : 'text-stone-600'
                    }`}
                  >
                    <dt className="col-start-1 row-start-1 flex justify-center pt-0.5 text-lg leading-none" aria-hidden>
                      📅
                    </dt>
                    <dd className="col-start-2 row-start-1 min-w-0 leading-snug">
                      <span className={`font-semibold ${pkg.soldOut ? 'text-stone-600' : 'text-stone-800'}`}>Duration:</span>{' '}
                      <span className="text-balance">{pkg.duration}</span>
                    </dd>
                    <dt className="col-start-1 row-start-2 flex justify-center pt-0.5 text-lg leading-none" aria-hidden>
                      🗓️
                    </dt>
                    <dd className="col-start-2 row-start-2 min-h-[2.75rem] min-w-0 leading-snug sm:min-h-[3rem]">
                      <span className={`font-semibold ${pkg.soldOut ? 'text-stone-600' : 'text-stone-800'}`}>Dates:</span>{' '}
                      <span className="text-pretty">{pkg.dates}</span>
                    </dd>
                  </dl>

                  <div className="mt-4 min-h-[2.75rem] w-full text-center">
                    <p
                      className={`mx-auto max-w-xs text-sm leading-snug sm:max-w-sm sm:text-[0.9375rem] ${
                        pkg.soldOut ? 'text-stone-400' : 'text-stone-600'
                      }`}
                    >
                      {pkg.tagline}
                    </p>
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
                    className={`mt-auto flex min-h-[3.25rem] w-full items-center justify-center rounded-2xl px-6 py-3 text-base font-bold transition-all duration-300 sm:text-lg ${
                      pkg.soldOut
                        ? 'cursor-not-allowed bg-stone-200/80 text-stone-400'
                        : pkg.status === 'inquiry'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 active:translate-y-0'
                          : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 active:translate-y-0'
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
