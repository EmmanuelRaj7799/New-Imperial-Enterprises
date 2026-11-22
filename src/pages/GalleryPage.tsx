import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Expand,
  MessageCircle,
  X,
} from 'lucide-react';
import { CinematicHero } from '../components/CinematicHero';
import { ResilientImage } from '../components/ResilientImage';
import { FinalCtaBanner } from '../components/FinalCtaBanner';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  GALLERY_FILTERS,
  GALLERY_ITEMS,
  IMAGES,
  buildWhatsAppUrl,
  type GalleryCategory,
} from '../data/businessData';

export function GalleryPage() {
  usePageMeta({
    title: 'Project Gallery | Aluminium, Glass, UPVC & Interiors',
    description:
      'Browse architectural aluminium windows, 12 mm glass partitions, glass elevations, UPVC doors, gypsum ceilings, ACP facades, railings, and MS fabrication by New Imperial Enterprises.',
    keywords:
      'Aluminium Windows Gallery, Glass Partition Showcase, UPVC Doors Photos, Gypsum Ceiling Designs, ACP Elevation Cladding, Glass Railing Projects, New Imperial Enterprises',
    image: IMAGES.acpMetalwork,
    imageAlt: 'New Imperial Enterprises architectural project gallery featuring ACP cladding, glass and aluminium',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Gallery', path: '/gallery' },
    ],
    schema: {
      '@type': 'ImageGallery',
      name: 'New Imperial Enterprises Architectural Work Showcase',
      description:
        'Visual showcase of aluminium fabrication, glass partitions, UPVC windows and doors, ceilings, railings, ACP cladding, and interior craftsmanship.',
    },
  });

  const [activeFilter, setActiveFilter] = useState<GalleryCategory>('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'ALL') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter(
      (item) =>
        item.category === activeFilter || item.secondaryCategories?.includes(activeFilter)
    );
  }, [activeFilter]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? filteredItems.length - 1 : prev - 1;
    });
  }, [filteredItems.length]);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === filteredItems.length - 1 ? 0 : prev + 1;
    });
  }, [filteredItems.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div>
      {/* VIDEO-READY ARCHITECTURAL PORTFOLIO HERO */}
      <CinematicHero
        videoSlot="gallery"
        posterSrc={IMAGES.heroFacade}
        posterAlt="Architectural glass and aluminium facade montage"
        minHeightClass="min-h-[66vh]"
      >
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#D6B36A] mb-4">
            Architectural Visual Showcase
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-[-0.03em] leading-[1.08] text-white">
            OUR WORK. OUR CRAFT.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[#C8D0DA] leading-relaxed max-w-2xl">
            A visual collection of aluminium, glass, UPVC, interior and fabrication possibilities.
          </p>
        </div>
      </CinematicHero>

      {/* FILTER BAR & MASONRY ARCHITECTURAL PORTFOLIO */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10">
          {/* Transparent Illustrative Photography Notice */}
          <div className="mb-10 pb-8 border-b border-slate-200 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-2">
                Filter by Discipline
              </p>
              <p className="text-sm text-slate-600 max-w-2xl">
                Representative architectural reference visuals illustrating the range of aluminium,
                glass, UPVC, ceiling, railing, and metal works undertaken. All gallery slots are
                structured to be replaced with your own completed site photography.
              </p>
            </div>

            <div className="text-xs text-slate-500 font-mono tabular-nums shrink-0">
              Showing {filteredItems.length} of {GALLERY_ITEMS.length} visual showcases
            </div>
          </div>

          {/* Interactive Category Filters */}
          <div
            role="tablist"
            aria-label="Filter gallery by work category"
            className="flex flex-wrap items-center gap-2 mb-12"
          >
            {GALLERY_FILTERS.map((category) => {
              const active = activeFilter === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setActiveFilter(category);
                    setLightboxIndex(null);
                  }}
                  className={`px-4 py-2.5 rounded-lg text-xs font-semibold tracking-[0.06em] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#101C35] text-white'
                      : 'bg-[#F2F4F7] text-slate-700 hover:bg-slate-200/80 hover:text-[#101C35]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Premium Masonry Grid (Landscape + Portrait + Wide Mix) */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item, idx) => {
              const aspectClass =
                item.aspect === 'portrait'
                  ? 'aspect-[3/4]'
                  : item.aspect === 'wide'
                    ? 'aspect-[16/10]'
                    : 'aspect-[4/3]';

              return (
                <motion.figure
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="break-inside-avoid group rounded-2xl overflow-hidden border border-slate-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    aria-label={`Open full-screen preview of ${item.title}`}
                    className={`relative block w-full ${aspectClass} overflow-hidden bg-[#101C35] text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769FF]`}
                  >
                    <ResilientImage
                      src={item.image}
                      alt={item.alt}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#080B12]/0 group-hover:bg-[#080B12]/35 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#080B12]/80 backdrop-blur-md text-white text-xs font-semibold border border-white/15">
                        <Expand className="w-3.5 h-3.5 text-[#00CFFF]" aria-hidden="true" />
                        <span>Inspect Full View</span>
                      </span>
                    </div>
                  </button>

                  <figcaption className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                      <span className="font-semibold text-[#1769FF]">{item.category}</span>
                      {item.secondaryCategories && item.secondaryCategories.length > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{item.secondaryCategories.join(' · ')}</span>
                        </>
                      )}
                    </div>
                    <h2 className="font-display text-lg font-bold text-[#101C35] leading-snug">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{item.subtitle}</p>
                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Link
                        to={item.serviceRoute}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#101C35] hover:text-[#1769FF] transition-colors"
                      >
                        <span>Related Service</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(idx)}
                        className="text-xs font-semibold text-[#1769FF] hover:underline cursor-pointer"
                      >
                        Open Lightbox
                      </button>
                    </div>
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* FULL-SCREEN LIGHTBOX */}
      <AnimatePresence>
        {activeItem && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={activeItem.title}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-[#080B12]/94 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
          >
            {/* Top Bar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between gap-4 text-white max-w-[1360px] w-full mx-auto"
            >
              <div className="text-xs font-mono text-[#C8D0DA] tabular-nums">
                {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
                {String(filteredItems.length).padStart(2, '0')} · {activeItem.category}
              </div>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close lightbox"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Viewer + Prev/Next Controls */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex-1 flex items-center justify-center my-4 max-w-[1360px] w-full mx-auto min-h-0"
            >
              <button
                type="button"
                onClick={showPrev}
                aria-label="Previous image"
                className="absolute left-0 sm:left-2 z-10 w-11 h-11 rounded-full bg-[#080B12]/80 hover:bg-[#1769FF] border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <motion.img
                key={activeItem.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.22 }}
                src={activeItem.image}
                alt={activeItem.alt}
                referrerPolicy="no-referrer"
                className="max-h-[68vh] max-w-[82vw] object-contain rounded-xl shadow-2xl border border-white/10"
              />

              <button
                type="button"
                onClick={showNext}
                aria-label="Next image"
                className="absolute right-0 sm:right-2 z-10 w-11 h-11 rounded-full bg-[#080B12]/80 hover:bg-[#1769FF] border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Caption & Actions */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-[1000px] w-full mx-auto bg-white/[0.06] border border-white/12 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white"
            >
              <div>
                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  {activeItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#C8D0DA] mt-0.5">{activeItem.subtitle}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to={activeItem.serviceRoute}
                  onClick={closeLightbox}
                  className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/45 text-xs font-semibold text-white whitespace-nowrap"
                >
                  View Service
                </Link>
                <a
                  href={buildWhatsAppUrl(
                    `Hello New Imperial Enterprises, I would like to enquire about ${activeItem.title}. Please contact me.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-xs font-semibold text-white whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Enquire</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FinalCtaBanner />
    </div>
  );
}
