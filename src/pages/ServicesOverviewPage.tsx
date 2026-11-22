import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { CinematicHero } from '../components/CinematicHero';
import { ResilientImage } from '../components/ResilientImage';
import { Tilt3DCard } from '../components/Tilt3DCard';
import { FaqAccordion } from '../components/FaqAccordion';
import { FinalCtaBanner } from '../components/FinalCtaBanner';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  ADDITIONAL_SERVICES,
  IMAGES,
  SERVICE_CATEGORIES,
  buildWhatsAppUrl,
} from '../data/businessData';

export function ServicesOverviewPage() {
  usePageMeta({
    title: 'Services | Aluminium, Glass, UPVC, Ceilings, Railings & ACP | New Imperial Enterprises',
    description:
      'Explore complete services by New Imperial Enterprises: aluminium works, 12 mm & 45x25 glass partitions, UPVC windows & doors, gypsum & 2x2 grid ceilings, ACP, railings, MS works, curtains and electrical works.',
  });

  return (
    <div>
      {/* VIDEO-READY SERVICES MONTAGE HERO */}
      <CinematicHero
        videoSlot="services"
        posterSrc={IMAGES.glassPartitions}
        posterAlt="Architectural glass partitions, aluminium framing, and modern workspace interiors"
        minHeightClass="min-h-[68vh]"
      >
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#D6B36A] mb-4">
            Complete Service Portfolio
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.03em] leading-[1.1] text-white">
            Architectural Fabrication, Glazing &amp; Interior Solutions.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#C8D0DA] leading-relaxed max-w-2xl">
            From structural aluminium framing and 12 mm glass partitions to UPVC installations,
            gypsum &amp; 2x2 grid ceilings, railings, ACP cladding, and customized interior works—all
            coordinated through one team.
          </p>
        </div>
      </CinematicHero>

      {/* FIVE MAJOR SERVICE DIVISIONS */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10 space-y-20">
          {SERVICE_CATEGORIES.map((category, idx) => {
            const reversed = idx % 2 === 1;
            return (
              <motion.article
                key={category.slug}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch pb-20 border-b border-slate-200 last:border-b-0 last:pb-0"
              >
                <div className={`lg:col-span-6 ${reversed ? 'lg:order-2' : ''}`}>
                  <Tilt3DCard className="h-full min-h-[300px] lg:min-h-[420px] rounded-2xl overflow-hidden border border-slate-200">
                    <Link to={category.route} className="block w-full h-full group">
                      <ResilientImage
                        src={category.image}
                        alt={category.imageAlt}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                  </Tilt3DCard>
                </div>

                <div
                  className={`lg:col-span-6 flex flex-col justify-center ${
                    reversed ? 'lg:order-1' : ''
                  }`}
                >
                  <span className="font-mono text-xs font-semibold text-[#1769FF] tabular-nums">
                    {category.index} · Core Division
                  </span>
                  <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101C35]">
                    {category.title}
                  </h2>
                  <p className="mt-4 text-base text-slate-600 leading-relaxed">
                    {category.heroDescription}
                  </p>

                  {/* Complete sub-services list (clean unboxed typographic list) */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pt-5 border-t border-slate-200/80">
                    {category.items.map((item) => (
                      <div key={item.title} className="flex items-baseline gap-2.5 text-sm text-[#101C35]">
                        <span className="text-[#1769FF] font-semibold" aria-hidden="true">
                          —
                        </span>
                        <span className="font-medium">{item.title}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      to={category.route}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#101C35] hover:bg-[#1769FF] text-white text-sm font-semibold transition-colors whitespace-nowrap"
                    >
                      <span>Explore {category.title}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>

                    <a
                      href={buildWhatsAppUrl(
                        `Hello New Imperial Enterprises, I would like to enquire about ${category.title}. Please contact me.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 hover:border-[#16A34A] text-sm font-semibold text-[#101C35] hover:text-[#15803D] transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      <span>WhatsApp Enquiry</span>
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* ADDITIONAL SERVICES SECTION */}
      <section
        id="additional-services"
        className="bg-[#080B12] text-white py-20 lg:py-28 scroll-mt-20"
      >
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#D6B36A] mb-3">
              Additional Services
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Supporting finishes and customized fabrication.
            </h2>
            <p className="mt-4 text-base text-[#C8D0DA] leading-relaxed">
              Alongside our core aluminium, glass, UPVC, ceiling, and metal divisions, we undertake
              complementary finishing and custom architectural works so spaces come together
              cohesively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {ADDITIONAL_SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 grid grid-cols-1 sm:grid-cols-12"
              >
                <div className="sm:col-span-5 min-h-[210px]">
                  <ResilientImage
                    src={service.image}
                    alt={service.imageAlt}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="sm:col-span-7 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">{service.title}</h3>
                    <p className="mt-2.5 text-sm text-[#C8D0DA] leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <Link
                      to={service.route}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00CFFF] hover:text-white transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                    <a
                      href={buildWhatsAppUrl(
                        `Hello New Imperial Enterprises, I would like to enquire about ${service.title}. Please contact me.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#86EFAC] hover:text-white transition-colors"
                    >
                      Enquire on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-[#F2F4F7] py-20 lg:py-24">
        <div className="max-w-[1000px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-2">
              Service Questions
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#101C35]">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 px-6 sm:px-8 py-2">
            <FaqAccordion />
          </div>
        </div>
      </section>

      <FinalCtaBanner />
    </div>
  );
}
