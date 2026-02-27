'use client';

import Image from 'next/image';
import { SACRED_SITES, EXPERIENCE_FEATURES } from '@/config/site';

interface TafSeerahSectionProps {
  currentSacredSite: number;
  onPrevSacredSite: () => void;
  onNextSacredSite: () => void;
  onGoToSacredSite: (index: number) => void;
}

const WHATS_INCLUDED = [
  {
    icon: '✈️',
    title: 'Travel & Accommodation',
    items: [
      { name: 'Airfare', desc: 'Flights to & from MSP (or your preferred airport)' },
      { name: '5-Star Hotels', desc: 'Walking distance from the Haramain' },
      { name: 'Visa Processing', desc: 'Multiple entry 1 year visa' },
    ],
  },
  {
    icon: '🕌',
    title: 'Spiritual Experience',
    items: [
      { name: 'Rawdah Access', desc: 'Experience a piece of Jannah' },
      { name: 'Qiyam', desc: 'Reconnect with Allah with group-led Qiyam at night' },
      { name: 'Jummah Prayers', desc: 'Offer your Jummah Prayer at both Haramain' },
    ],
  },
  {
    icon: '📚',
    title: 'Learning & Guidance',
    items: [
      { name: 'Umrah Guidebook', desc: 'A step-by-step guide that details everything you need to know' },
      { name: 'Tadabbur Circles', desc: 'An opportunity to slow down & reflect on the experience' },
      { name: 'Guided Ziyarat', desc: 'Learn the story behind every location you visit' },
    ],
  },
  {
    icon: '🍽️',
    title: 'Comfort & Convenience',
    items: [
      { name: 'Transportation', desc: 'VIP buses to & from every location' },
      { name: 'Daily breakfast', desc: '5-star complimentary breakfast buffet' },
      { name: 'Ihram & Hijab', desc: 'Men are gifted an Ihram while women are gifted a Hijab' },
    ],
  },
];

export default function TafSeerahSection({
  currentSacredSite,
  onPrevSacredSite,
  onNextSacredSite,
  onGoToSacredSite,
}: TafSeerahSectionProps) {
  const site = SACRED_SITES[currentSacredSite];

  return (
    <section id="taf-seerah" className="py-20 bg-gradient-to-br from-stone-200 to-stone-100 text-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-stone-800 to-stone-700 bg-clip-text text-transparent">
            The Experience
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-stone-400 to-stone-600 mx-auto rounded-full" />
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-bold mb-8 text-center">What We Offer</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {EXPERIENCE_FEATURES.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-stone-200 hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold mb-3 text-stone-800">{feature.title}</h4>
                <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-stone-800">Sacred Sites We Visit</h3>
            <p className="text-stone-600">Explore the landmarks where our journey brings the Seerah to life.</p>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="relative bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative h-80 md:h-96">
                <Image
                  src={`/${site.image}`}
                  alt={site.name}
                  fill
                  className="object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h4 className="text-3xl md:text-4xl font-bold mb-3">{site.name}</h4>
                  <p className="text-lg leading-relaxed text-white/95">{site.description}</p>
                </div>
              </div>
              <button
                onClick={onPrevSacredSite}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-10"
                aria-label="Previous sacred site"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={onNextSacredSite}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-10"
                aria-label="Next sacred site"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex justify-center gap-3 mt-8">
              {SACRED_SITES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => onGoToSacredSite(index)}
                  className={`transition-all duration-300 ${
                    currentSacredSite === index
                      ? 'w-12 h-3 bg-gradient-to-r from-stone-600 to-stone-700 rounded-full'
                      : 'w-3 h-3 bg-stone-300 hover:bg-stone-400 rounded-full'
                  }`}
                  aria-label={`Go to ${SACRED_SITES[index].name}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold mb-8 text-center text-stone-800">What&apos;s Included</h3>
          <p className="text-center text-stone-600 mb-12 text-xl">Everything you need for a complete spiritual journey</p>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {WHATS_INCLUDED.map((category, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-200/40 blur-3xl" />
                  <div className="absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
                </div>
                <div className="relative flex h-full flex-col p-8">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                      {category.icon}
                    </span>
                    <h4 className="text-xl font-bold text-stone-800">{category.title}</h4>
                  </div>
                  <ul className={`mt-6 space-y-7 ${category.title === 'Learning & Guidance' ? 'pb-4' : ''}`}>
                    {category.items.map((item, itemIndex) => {
                      const isLast = itemIndex === category.items.length - 1;
                      return (
                        <li key={itemIndex} className="relative pl-12">
                          <span className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-500 bg-white text-sm font-semibold text-emerald-600">
                            ✓
                          </span>
                          {!isLast && <span className="absolute left-3.5 top-9 h-full w-0.5 bg-emerald-100" />}
                          <div className="space-y-2">
                            <p className="font-semibold text-stone-800">{item.name}</p>
                            <p className="text-sm text-stone-600 leading-relaxed">{item.desc}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-auto mb-[1px] h-px w-full bg-gradient-to-r from-emerald-200 via-stone-200 to-amber-200" />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-stone-500">
            Thoughtfully curated so you can focus on reflection, not logistics.
          </p>
        </div>
      </div>
    </section>
  );
}
