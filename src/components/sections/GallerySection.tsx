'use client';

import Image from 'next/image';
import { GALLERY_SLIDES, FLICKR_GALLERY_URL } from '@/config/site';
import EmblaCarousel from '@/components/ui/EmblaCarousel';

export default function GallerySection() {
  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-stone-700 to-stone-800 bg-clip-text text-transparent">
            Captured Moments
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-stone-400 to-stone-600 mx-auto rounded-full" />
        </div>

        <div className="mb-12 max-w-6xl mx-auto">
          <EmblaCarousel
            slideCount={GALLERY_SLIDES.length}
            ariaLabel="Captured moments photo gallery"
            autoplayMs={5000}
            viewportClassName="shadow-2xl ring-1 ring-stone-200/60"
            renderSlide={(i) => (
              <div className="relative aspect-[4/3] w-full max-h-[min(72vh,640px)] sm:aspect-[16/10]">
                <Image
                  src={`/${GALLERY_SLIDES[i]}`}
                  alt={`Gallery photo ${i + 1} of ${GALLERY_SLIDES.length}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1152px"
                  priority={i === 0}
                />
              </div>
            )}
            renderBelow={({ scrollTo, selectedIndex }) => (
              <div
                className="mt-8 flex max-w-4xl mx-auto gap-2 overflow-x-auto overscroll-x-contain px-1 pb-2 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]"
                role="navigation"
                aria-label="Gallery thumbnails"
              >
                {GALLERY_SLIDES.map((slide, i) => (
                  <button
                    key={slide}
                    type="button"
                    onClick={() => scrollTo(i)}
                    aria-label={`Show photo ${i + 1}`}
                    aria-current={selectedIndex === i}
                    className={`relative h-14 w-14 shrink-0 snap-start overflow-hidden rounded-xl ring-2 transition-all sm:h-[4.5rem] sm:w-[4.5rem] ${
                      selectedIndex === i
                        ? 'ring-stone-600 scale-[1.02] shadow-md'
                        : 'ring-transparent opacity-90 hover:opacity-100 hover:ring-stone-300'
                    }`}
                  >
                    <Image
                      src={`/${slide}`}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        <div className="text-center mt-12">
          <p className="text-stone-600 mb-6 text-lg">
            A view into the smiles, sights, and moments that touched our hearts.
          </p>
          <a
            href={FLICKR_GALLERY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-stone-600 via-stone-700 to-stone-800 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <span className="mr-3 text-xl" aria-hidden>
              📸
            </span>
            View Full Gallery on Flickr
            <span className="ml-3 text-lg" aria-hidden>
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
