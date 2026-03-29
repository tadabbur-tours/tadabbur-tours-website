'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export type CarouselBelowRenderProps = {
  scrollTo: (index: number) => void;
  selectedIndex: number;
};

export type EmblaCarouselProps = {
  slideCount: number;
  renderSlide: (index: number) => ReactNode;
  ariaLabel: string;
  autoplayMs?: number;
  loop?: boolean;
  className?: string;
  viewportClassName?: string;
  /** Thumbnail strip or other synced UI (e.g. gallery grid) */
  renderBelow?: (props: CarouselBelowRenderProps) => ReactNode;
  /** Hide default dot strip when using renderBelow only */
  hideDots?: boolean;
};

/**
 * Touch-friendly carousel: swipe/drag, keyboard when focused, autoplay pauses on interaction.
 * Prev/next overlays show only for fine pointers (mouse/trackpad); hidden on coarse (phones) where swipe is primary.
 * Respects `prefers-reduced-motion` (disables autoplay).
 */
export default function EmblaCarousel({
  slideCount,
  renderSlide,
  ariaLabel,
  autoplayMs = 0,
  loop = true,
  className = '',
  viewportClassName = '',
  renderBelow,
  hideDots = false,
}: EmblaCarouselProps) {
  const reducedMotion = usePrefersReducedMotion();
  const plugins = useMemo(() => {
    if (autoplayMs <= 0 || reducedMotion) return [];
    return [
      Autoplay({
        delay: autoplayMs,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    ];
  }, [autoplayMs, reducedMotion]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop,
      align: 'start',
      containScroll: 'trimSnaps',
      dragFree: false,
    },
    plugins
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('reInit', onSelect);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  const showDefaultDots = !hideDots && !renderBelow;

  return (
    <div className={className}>
      <div
        className="relative outline-none"
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        <div className={`overflow-hidden ${viewportClassName}`} ref={emblaRef}>
          <div className="flex touch-pan-y">
            {Array.from({ length: slideCount }, (_, i) => (
              <div
                className="min-w-0 flex-[0_0_100%] transform-gpu"
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${slideCount}`}
                aria-hidden={selectedIndex !== i}
              >
                {renderSlide(i)}
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 hidden items-center justify-between px-0.5 sm:px-1 [@media(pointer:fine)]:flex">
          <button
            type="button"
            className="pointer-events-auto ml-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-200/80 bg-white/95 text-stone-800 shadow-lg backdrop-blur-sm transition hover:bg-white hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 sm:ml-1 sm:h-12 sm:w-12"
            onClick={scrollPrev}
            aria-label="Previous slide"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            className="pointer-events-auto mr-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-200/80 bg-white/95 text-stone-800 shadow-lg backdrop-blur-sm transition hover:bg-white hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 sm:mr-1 sm:h-12 sm:w-12"
            onClick={scrollNext}
            aria-label="Next slide"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {showDefaultDots && (
        <div
          className="mt-4 flex justify-center gap-2 overflow-x-auto px-1 py-1 sm:mt-6"
          aria-label="Slide indicators"
        >
          {Array.from({ length: slideCount }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={selectedIndex === i}
              className={`h-2.5 shrink-0 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2 ${
                selectedIndex === i
                  ? 'w-8 bg-gradient-to-r from-stone-500 to-stone-600'
                  : 'h-2.5 w-2.5 bg-stone-300 hover:bg-stone-400 sm:h-3 sm:w-3'
              }`}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
      )}

      {renderBelow?.({ scrollTo, selectedIndex })}
    </div>
  );
}
