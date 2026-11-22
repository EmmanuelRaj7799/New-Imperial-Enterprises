import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { CinematicHero } from '../components/CinematicHero';
import { ResilientImage } from '../components/ResilientImage';
import { FinalCtaBanner } from '../components/FinalCtaBanner';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  BUSINESS_INFO,
  SERVICE_CATEGORIES,
  buildWhatsAppUrl,
  type ServiceCategory,
} from '../data/businessData';

interface ServiceDetailPageProps {
  slug: string;
}

export function ServiceDetailPage({ slug }: ServiceDetailPageProps) {
  const category: ServiceCategory =
    SERVICE_CATEGORIES.find((c) => c.slug === slug) ?? SERVICE_CATEGORIES[0];

  usePageMeta({
    title: category.seoTitle,
    description: category.seoDescription,
    keywords: `${category.title}, ${category.items.map((item) => item.title).join(', ')}, New Imperial Enterprises`,
    image: category.image,
    imageAlt: category.imageAlt,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: category.title, path: category.route },
    ],
    schema: {
      '@type': 'Service',
      name: category.title,
      serviceType: category.title,
      description: category.seoDescription,
      provider: {
        '@type': 'HomeAndConstructionBusiness',
        name: BUSINESS_INFO.displayName,
        email: BUSINESS_INFO.email,
        telephone: ['+91-9700110084', '+91-7013248518'],
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: category.title,
        itemListElement: category.items.map((item) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: item.title,
            description: item.description,
          },
        })),
      },
    },
  });

  const relatedCategories = SERVICE_CATEGORIES.filter((c) =>
    category.relatedSlugs.includes(c.slug)
  );

  const serviceWhatsAppMsg = `Hello New Imperial Enterprises, I would like to enquire about ${category.title}. Please contact me.`;

  return (
    <div>
      {/* SERVICE DETAIL HERO */}
      <CinematicHero
        videoSlot="services"
        posterSrc={category.image}
        posterAlt={category.imageAlt}
        minHeightClass="min-h-[68vh]"
      >
        <div className="max-w-3xl">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] text-[#C8D0DA] hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to All Services</span>
          </Link>

          <p className="font-mono text-xs text-[#D6B36A] tracking-[0.16em] mb-3">
            {category.index} · {BUSINESS_INFO.name}
          </p>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.03em] leading-[1.1] text-white">
            {category.title}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#C8D0DA] leading-relaxed max-w-2xl">
            {category.heroDescription}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/contact#enquiry-form"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#1769FF] hover:bg-[#1458D6] text-white text-sm font-semibold transition-colors btn-metallic-sheen whitespace-nowrap"
            >
              <span>Request a Project Discussion</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <a
              href={buildWhatsAppUrl(serviceWhatsAppMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>WhatsApp About {category.shortTitle}</span>
            </a>
          </div>
        </div>
      </CinematicHero>

      {/* VISUAL OVERVIEW SPLIT */}
      <section className="bg-white py-16 lg:py-24 border-b border-slate-200/80">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-200 min-h-[320px]">
              <ResilientImage
                src={category.image}
                alt={category.imageAlt}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-[#F2F4F7] border border-slate-200/80 p-8">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-3">
                  Scope Included
                </p>
                <h2 className="font-display text-2xl font-bold text-[#101C35]">
                  {category.tagline}
                </h2>
                <ul className="mt-6 space-y-2.5 text-sm text-slate-700">
                  {category.items.map((item, i) => (
                    <li key={item.title} className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-[#1769FF] tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-medium text-[#101C35]">{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-300/60 flex flex-wrap items-center gap-4 text-sm">
                <a
                  href={BUSINESS_INFO.phones[0].href}
                  className="inline-flex items-center gap-2 font-semibold text-[#101C35] hover:text-[#1769FF]"
                >
                  <Phone className="w-4 h-4 text-[#1769FF]" aria-hidden="true" />
                  <span className="font-mono tabular-nums">{BUSINESS_INFO.phones[0].display}</span>
                </a>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <a
                  href={BUSINESS_INFO.phones[1].href}
                  className="font-mono font-semibold text-[#101C35] hover:text-[#1769FF] tabular-nums"
                >
                  {BUSINESS_INFO.phones[1].display}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED SUB-SERVICES BREAKDOWN */}
      <section className="bg-[#F2F4F7] py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-3">
              Detailed Offerings
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101C35]">
              Every {category.title.toLowerCase()} discipline we undertake.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {category.items.map((item, idx) => {
              const anchorId = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <motion.div
                  key={item.title}
                  id={anchorId}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: 0.42, delay: (idx % 2) * 0.06 }}
                  className="rounded-2xl bg-white border border-slate-200 p-7 sm:p-8 flex flex-col justify-between scroll-mt-24"
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <span className="font-mono text-xs font-semibold text-[#1769FF] tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.applications.slice(0, 2).join(' · ')}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-[#101C35]">{item.title}</h3>

                    <p className="mt-3 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-[#101C35] mb-2">
                          Key Craft &amp; Benefits
                        </h4>
                        <ul className="space-y-1.5 text-sm text-slate-600">
                          {item.highlights.map((h) => (
                            <li key={h} className="flex items-baseline gap-2.5">
                              <span className="text-[#1769FF]" aria-hidden="true">
                                —
                              </span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-[#101C35] mb-1">
                          Typical Applications
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {item.applications.join(' · ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                    <a
                      href={buildWhatsAppUrl(
                        `Hello New Imperial Enterprises, I would like to enquire about ${item.title}. Please contact me.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#15803D] hover:text-[#166534]"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      <span>Enquire on WhatsApp</span>
                    </a>

                    <Link
                      to="/contact#enquiry-form"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#101C35] hover:text-[#1769FF]"
                    >
                      <span>Contact Form</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RELATED SERVICES INTERNAL LINKING */}
      <section className="bg-white py-20 border-t border-slate-200/80">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-2">
                Related Services
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#101C35]">
                Explore complementary divisions
              </h2>
            </div>
            <Link
              to="/gallery"
              className="text-sm font-semibold text-[#101C35] hover:text-[#1769FF] whitespace-nowrap"
            >
              Browse Visual Gallery →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedCategories.map((rel) => (
              <Link
                key={rel.slug}
                to={rel.route}
                className="group rounded-2xl overflow-hidden border border-slate-200 bg-white hover:border-[#1769FF]/45 transition-colors flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#101C35]">
                  <ResilientImage
                    src={rel.image}
                    alt={rel.imageAlt}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-xs text-[#1769FF] tabular-nums">
                      {rel.index}
                    </span>
                    <h3 className="mt-1.5 font-display text-lg font-bold text-[#101C35] group-hover:text-[#1769FF] transition-colors">
                      {rel.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">{rel.summary}</p>
                  </div>
                  <div className="mt-4 text-sm font-semibold text-[#101C35] group-hover:text-[#1769FF] inline-flex items-center gap-1.5">
                    <span>Explore Service</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCtaBanner
        heading={`Planning ${category.title} for Your Space?`}
        description={`Connect with New Imperial Enterprises to discuss site dimensions, material options, and execution details for ${category.title.toLowerCase()}.`}
        whatsAppMessage={serviceWhatsAppMsg}
      />
    </div>
  );
}
