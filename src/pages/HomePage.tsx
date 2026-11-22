import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, MessageCircle, Phone } from 'lucide-react';
import { CinematicHero } from '../components/CinematicHero';
import { Tilt3DCard } from '../components/Tilt3DCard';
import { ResilientImage } from '../components/ResilientImage';
import { Interactive3DShowcase } from '../components/Interactive3DShowcase';
import { FaqAccordion } from '../components/FaqAccordion';
import { FinalCtaBanner } from '../components/FinalCtaBanner';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  BUSINESS_INFO,
  GALLERY_ITEMS,
  HOME_SERVICE_CARDS,
  IMAGES,
  PROCESS_STAGES,
  WHY_CHOOSE_US_ITEMS,
  buildWhatsAppUrl,
} from '../data/businessData';

export function HomePage() {
  usePageMeta({
    title: 'New Imperial Enterprises | Aluminium, Glass, UPVC & Interiors',
    description:
      'New Imperial Enterprises delivers aluminium fabrication, 12 mm glass partitions, UPVC windows & doors, gypsum ceilings, railings, ACP & interior works. Call 9700110084.',
    keywords:
      'New Imperial Enterprises, Aluminium Fabrication, Aluminium Windows and Doors, 12mm Glass Partitions, 45x25 Glass Partition Systems, UPVC Windows and Doors, Gypsum Ceilings, 2x2 Grid Ceilings, ACP Cladding, SS Glass Railings, MS Works, Interior Works',
    image: IMAGES.heroFacade,
    imageAlt: 'New Imperial Enterprises architectural aluminium framing and reflective glass facade',
    breadcrumbs: [{ name: 'Home', path: '/' }],
  });

  const featuredGallery = [
    GALLERY_ITEMS[0],
    GALLERY_ITEMS[1],
    GALLERY_ITEMS[2],
    GALLERY_ITEMS[4],
    GALLERY_ITEMS[6],
  ];

  return (
    <div>
      {/* FULL-SCREEN CINEMATIC HERO WITH RIGHT-SIDE 360° 3D MODEL */}
      <CinematicHero
        videoSlot="home"
        posterSrc={IMAGES.heroFacade}
        posterAlt="Modern architectural building featuring dark anodized aluminium frames and reflective glass facade"
        minHeightClass="min-h-[94vh]"
        hideDecorativeWireframe
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          <div className="lg:col-span-6">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-xs sm:text-sm font-semibold tracking-[0.22em] text-[#D6B36A] mb-5"
            >
              {BUSINESS_INFO.name}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-5xl xl:text-[56px] font-bold tracking-[-0.03em] leading-[1.08] text-white"
            >
              Crafting Spaces. Creating Possibilities.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-base sm:text-lg text-[#C8D0DA] leading-[1.68] max-w-xl"
            >
              From aluminium windows and glass partitions to UPVC installations and complete
              interior solutions, New Imperial Enterprises offers a wide range of services for
              modern residential and commercial spaces.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-4 rounded-lg bg-[#1769FF] hover:bg-[#1458D6] text-white text-sm font-semibold tracking-[0.04em] transition-colors btn-metallic-sheen whitespace-nowrap"
              >
                <span>EXPLORE OUR SERVICES</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </Link>

              <Link
                to="/contact#enquiry-form"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-4 rounded-lg border border-white/25 bg-white/[0.04] hover:bg-white/[0.1] backdrop-blur-sm text-white text-sm font-semibold tracking-[0.04em] transition-colors whitespace-nowrap"
              >
                <span>DISCUSS YOUR PROJECT</span>
              </Link>
            </motion.div>

            {/* Clean unboxed architectural discipline line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.36 }}
              className="mt-10 pt-7 border-t border-white/12 flex flex-wrap items-center gap-x-3.5 gap-y-2 text-xs sm:text-sm text-[#C8D0DA]/80"
            >
              <span>Aluminium Fabrication</span>
              <span aria-hidden="true" className="text-[#D6B36A]">·</span>
              <span>Glass Works</span>
              <span aria-hidden="true" className="text-[#D6B36A]">·</span>
              <span>UPVC Windows & Doors</span>
              <span aria-hidden="true" className="text-[#D6B36A]">·</span>
              <span>Ceilings & Interiors</span>
              <span aria-hidden="true" className="text-[#D6B36A]">·</span>
              <span>Railings & ACP</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 w-full"
          >
            <Interactive3DShowcase variant="hero" />
          </motion.div>
        </div>
      </CinematicHero>

      {/* A. ABOUT INTRODUCTION (Bright Pure White Split Layout) */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col justify-center"
            >
              <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-3">
                About New Imperial Enterprises
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101C35] leading-[1.18]">
                Architectural materials, measured execution, and attention to every finish.
              </h2>
              <p className="mt-6 text-base text-slate-600 leading-[1.72]">
                New Imperial Enterprises brings aluminium fabrication, architectural glass works,
                UPVC windows and doors, ceilings, railings, workstations, ACP applications, and
                customized fabrication under one dedicated practice.
              </p>
              <p className="mt-4 text-base text-slate-600 leading-[1.72]">
                Every residential and commercial project carries distinct spatial and functional
                goals. We begin by understanding your space, discussing material choices clearly,
                and focusing on the joinery, alignment, and finishing details that define the
                completed interior or exterior.
              </p>

              <div className="mt-8 pt-7 border-t border-slate-200 flex flex-wrap items-center gap-6">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#101C35] hover:text-[#1769FF] transition-colors group"
                >
                  <span>Read About Our Approach</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>

                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  GSTIN: {BUSINESS_INFO.gstin}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <div className="relative h-full min-h-[340px] lg:min-h-[460px] rounded-2xl overflow-hidden border border-slate-200/80">
                <ResilientImage
                  src={IMAGES.workshopCraft}
                  alt="Aluminium fabrication studio showing extruded aluminium profiles and precision inspection"
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#080B12]/88 via-[#080B12]/45 to-transparent text-white">
                  <p className="text-xs text-[#D6B36A] font-medium">Precision Craftsmanship</p>
                  <p className="text-sm text-[#E5EAF1] mt-1">
                    Measured fabrication across aluminium, glass, UPVC, ceilings, and metalwork.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* B. OUR SERVICES (Light Architectural Grey Canvas + 3D Tilt Service Cards) */}
      <section className="bg-[#F2F4F7] py-20 lg:py-28 border-y border-slate-200/70">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-3">
                Our Core Capabilities
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101C35]">
                Complete architectural fabrication and interior solutions.
              </h2>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#101C35] hover:text-[#1769FF] transition-colors whitespace-nowrap shrink-0 group"
            >
              <span>View All Services</span>
              <ArrowRight
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {HOME_SERVICE_CARDS.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Tilt3DCard className="h-full rounded-2xl bg-white border border-slate-200/90 overflow-hidden group hover:border-[#1769FF]/45 hover:shadow-[0_20px_50px_rgba(16,28,53,0.10)] transition-shadow duration-300">
                  <Link to={card.route} className="flex flex-col h-full">
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#101C35]">
                      <ResilientImage
                        src={card.image}
                        alt={card.imageAlt}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="font-mono text-xs font-medium text-[#1769FF] tabular-nums">
                          {card.index}
                        </span>
                        <ArrowUpRight
                          className="w-4 h-4 text-slate-400 group-hover:text-[#1769FF] transition-colors"
                          aria-hidden="true"
                        />
                      </div>

                      <h3 className="font-display text-xl font-bold text-[#101C35] group-hover:text-[#1769FF] transition-colors">
                        {card.title}
                      </h3>

                      <p className="mt-2.5 text-sm text-slate-600 leading-relaxed flex-1">
                        {card.description}
                      </p>

                      <div className="mt-5 pt-4 border-t border-slate-100 inline-flex items-center gap-1.5 text-sm font-semibold text-[#101C35] group-hover:text-[#1769FF] transition-colors">
                        <span>Learn More</span>
                        <ArrowRight
                          className="w-4 h-4 transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Link>
                </Tilt3DCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* C. FEATURED WORK (Dark Obsidian Editorial Bento Showcase) */}
      <section className="bg-[#080B12] text-white py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#D6B36A] mb-3">
                Featured Architectural Possibilities
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Spaces shaped by aluminium, glass, light, and clean lines.
              </h2>
              <p className="mt-3 text-sm text-[#C8D0DA]/75">
                Illustrative architectural visuals representing the service categories we execute.
              </p>
            </div>

            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-white/20 hover:border-[#00CFFF] text-sm font-semibold text-white transition-colors whitespace-nowrap shrink-0"
            >
              <span>Explore Full Gallery</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Large Primary Feature */}
            <Link
              to="/gallery"
              className="md:col-span-7 group relative rounded-2xl overflow-hidden border border-white/10 min-h-[320px] lg:min-h-[420px]"
            >
              <ResilientImage
                src={featuredGallery[0].image}
                alt={featuredGallery[0].alt}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/90 via-[#080B12]/25 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8">
                <div className="text-xs text-[#00CFFF] font-medium mb-1">
                  {featuredGallery[0].category}
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {featuredGallery[0].title}
                </h3>
                <p className="mt-1.5 text-sm text-[#C8D0DA]/85 max-w-lg">
                  {featuredGallery[0].subtitle}
                </p>
              </div>
            </Link>

            {/* Right Secondary Feature */}
            <Link
              to="/gallery"
              className="md:col-span-5 group relative rounded-2xl overflow-hidden border border-white/10 min-h-[320px] lg:min-h-[420px]"
            >
              <ResilientImage
                src={featuredGallery[1].image}
                alt={featuredGallery[1].alt}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/90 via-[#080B12]/25 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8">
                <div className="text-xs text-[#00CFFF] font-medium mb-1">
                  {featuredGallery[1].category}
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  {featuredGallery[1].title}
                </h3>
                <p className="mt-1.5 text-sm text-[#C8D0DA]/85">
                  {featuredGallery[1].subtitle}
                </p>
              </div>
            </Link>

            {/* Bottom 3 Balanced Showcase Cards */}
            {featuredGallery.slice(2).map((item) => (
              <Link
                key={item.id}
                to="/gallery"
                className="md:col-span-4 group relative rounded-2xl overflow-hidden border border-white/10 h-[290px]"
              >
                <ResilientImage
                  src={item.image}
                  alt={item.alt}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/92 via-[#080B12]/30 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <div className="text-xs text-[#D6B36A] font-medium mb-1">{item.category}</div>
                  <h3 className="font-display text-lg font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* D. WHY CHOOSE US (Bright White Clean Architectural Grid) */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-3">
              Why Choose New Imperial Enterprises
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101C35]">
              Dependable workmanship across every residential and commercial detail.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
            {WHY_CHOOSE_US_ITEMS.map((item) => (
              <div
                key={item.index}
                className="bg-white p-7 hover:bg-[#F8FAFC] transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-semibold text-[#1769FF] tabular-nums">
                    {item.index}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold text-[#101C35]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E. OUR PROCESS (Midnight Navy 4-Stage Architectural Workflow) */}
      <section className="bg-[#101C35] text-white py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#00CFFF] mb-3">
              Our Process
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              From your initial enquiry to clean final finishing.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STAGES.map((stage, idx) => (
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
                className="rounded-2xl bg-white/[0.04] border border-white/10 p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl font-bold text-[#D6B36A] tabular-nums">
                      {stage.step}
                    </span>
                    <span className="h-px flex-1 ml-4 bg-gradient-to-r from-[#00CFFF]/50 to-transparent" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">{stage.title}</h3>
                  <p className="mt-3 text-sm text-[#C8D0DA] leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* F. FREQUENTLY ASKED QUESTIONS */}
      <section className="bg-[#F2F4F7] py-20 lg:py-24">
        <div className="max-w-[1000px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-2">
                Frequently Asked Questions
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-[#101C35]">
                Answers about our services and enquiry process.
              </h2>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={BUSINESS_INFO.phones[0].href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#101C35] hover:text-[#1769FF]"
              >
                <Phone className="w-4 h-4 text-[#1769FF]" aria-hidden="true" />
                <span className="font-mono tabular-nums">{BUSINESS_INFO.phones[0].display}</span>
              </a>
              <span aria-hidden="true" className="text-slate-300">/</span>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#15803D] hover:text-[#166534]"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 px-6 sm:px-8 py-2">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* G. FINAL CTA */}
      <FinalCtaBanner />
    </div>
  );
}
