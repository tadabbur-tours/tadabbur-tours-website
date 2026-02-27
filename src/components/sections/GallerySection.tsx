'use client';

import Image from 'next/image';
import { GALLERY_SLIDES, FLICKR_GALLERY_URL } from '@/config/site';

interface GallerySectionProps {
  currentSlide: number;
  onChangeSlide: (direction: number) => void;
  onGoToSlide: (index: number) => void;
}

export default function GallerySection({ currentSlide, onChangeSlide, onGoToSlide }: GallerySectionProps) {
  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-stone-700 to-stone-800 bg-clip-text text-transparent">
            Captured Moments
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-stone-400 to-stone-600 mx-auto rounded-full" />
        </div>

        <div className="mb-16">
          <div className="relative max-w-6xl mx-auto">
            <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
              <Image
                src={`/${GALLERY_SLIDES[currentSlide]}`}
                alt={`Gallery Image ${currentSlide + 1}`}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onChangeSlide(-1)}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
              aria-label="Previous image"
            >
              <span className="text-xl">‹</span>
            </button>
            <button
              onClick={() => onChangeSlide(1)}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
              aria-label="Next image"
            >
              <span className="text-xl">›</span>
            </button>

            <div className="flex justify-center mt-8 space-x-3">
              {GALLERY_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => onGoToSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-gradient-to-r from-stone-500 to-stone-600 scale-125'
                      : 'bg-stone-300 hover:bg-stone-400 hover:scale-110'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-12 max-w-4xl mx-auto">
            {GALLERY_SLIDES.map((slide, index) => (
              <div
                key={index}
                onClick={() => onGoToSlide(index)}
                className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  index === currentSlide ? 'ring-4 ring-stone-500 scale-105' : 'hover:scale-105 hover:ring-2 hover:ring-stone-300'
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
              <span className="mr-3 text-xl">📸</span>
              View Full Gallery on Flickr
              <span className="ml-3 text-lg">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
