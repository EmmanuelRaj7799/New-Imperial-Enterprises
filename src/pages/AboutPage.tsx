import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { CinematicHero } from '../components/CinematicHero';
import { ResilientImage } from '../components/ResilientImage';
import { FinalCtaBanner } from '../components/FinalCtaBanner';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  BUSINESS_INFO,
  IMAGES,
  SERVICE_CATEGORIES,
  WHY_CHOOSE_US_ITEMS,
} from '../data/businessData';

export function AboutPage() {
  usePageMeta({
    title: 'About New Imperial Enterprises | Fabrication & Interiors',
    description:
      'Discover New Imperial Enterprises — precision aluminium fabrication, glass partitions, UPVC windows & doors, gypsum ceilings, railings, ACP cladding, and interior solutions.',
    keywords:
      'About New Imperial Enterprises, Aluminium Fabrication Practice, Architectural Glass Craftsmanship, UPVC Specialists, Gypsum Ceiling Contractors, GSTIN 36BZUPM1868G1ZQ',
    image: IMAGES.workshopCraft,
    imageAlt: 'New Imperial Enterprises aluminium fabrication studio and profile inspection',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' },
    ],
    schema: {
      '@type': 'AboutPage',
      name: 'About New Imperial Enterprises',
      description:
        'Overview of New Imperial Enterprises architectural fabrication and interior execution across aluminium, glass, UPVC, ceilings, railings, ACP, and metalwork.',
    },
  });

  return (
    <div>
      {/* VIDEO-READY WORKSHOP HERO */}
      <CinematicHero
        videoSlot="about"
        posterSrc={IMAGES.workshopCraft}
        posterAlt="Aluminium fabrication workshop showing extruded profiles and architectural glass craftsmanship"
        minHeightClass="min-h-[70vh]"
      >
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#D6B36A] mb-4">
            About {BUSINESS_INFO.displayName}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.03em] leading-[1.1] text-white">
            Built Around Ideas, Materials and Craftsmanship.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-[#C8D0DA] leading-relaxed max-w-2xl">
            Thoughtful architectural execution across aluminium fabrication, glass partitions, UPVC
            installations, ceilings, railings, ACP cladding, and interior finishing.
          </p>
        </div>
      </CinematicHero>

      {/* WHO WE ARE */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-3">
                01. Who We Are
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101C35]">
                Practical craftsmanship for modern residential and commercial spaces.
              </h2>

              <p className="mt-6 text-base text-slate-600 leading-[1.75]">
                New Imperial Enterprises is a business offering a wide range of aluminium
                fabrication, glass, UPVC, interior and architectural works. Our services cover
                everything from windows, doors and partitions to ceilings, railings, workstations,
                ACP applications and customized fabrication requirements.
              </p>
              <p className="mt-4 text-base text-slate-600 leading-[1.75]">
                Every project has its own functional and visual requirements. Our approach is to
                understand the customer&apos;s needs, discuss suitable solutions and focus on the
                details that contribute to the finished work.
              </p>

              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                <span>
                  Registered GSTIN:{' '}
                  <strong className="font-mono text-[#101C35] tabular-nums">
                    {BUSINESS_INFO.gstin}
                  </strong>
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Residential &amp; Commercial Execution</span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[340px] rounded-2xl overflow-hidden border border-slate-200">
                <ResilientImage
                  src={IMAGES.aluminiumWindows}
                  alt="Precision black anodized aluminium French windows and doors installed in a modern space"
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="bg-[#F2F4F7] py-20 lg:py-28 border-y border-slate-200/70">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-3">
              02. What We Do
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101C35]">
              Five core divisions plus tailored interior and fabrication support.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                to={category.route}
                className="group rounded-2xl bg-white border border-slate-200 p-7 hover:border-[#1769FF]/45 transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-semibold text-[#1769FF] tabular-nums">
                    {category.index}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-bold text-[#101C35] group-hover:text-[#1769FF] transition-colors">
                    {category.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{category.summary}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 inline-flex items-center gap-1.5 text-sm font-semibold text-[#101C35] group-hover:text-[#1769FF]">
                  <span>Explore {category.shortTitle}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}

            <Link
              to="/services#additional-services"
              className="group rounded-2xl bg-[#101C35] text-white border border-white/10 p-7 hover:bg-[#152445] transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-semibold text-[#D6B36A] tabular-nums">
                  06
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-white">
                  Additional &amp; Custom Solutions
                </h3>
                <p className="mt-3 text-sm text-[#C8D0DA] leading-relaxed">
                  Black NDS curtains, electrical works, aluminium profile cupboard works, wooden
                  workstations, and customized site-specific fabrication.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 inline-flex items-center gap-1.5 text-sm font-semibold text-[#00CFFF]">
                <span>View Additional Services</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* OUR APPROACH & OUR COMMITMENT TO QUALITY */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10 space-y-20">
          {/* 03. Our Approach */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3]">
                <ResilientImage
                  src={IMAGES.glassPartitions}
                  alt="Clean architectural 12mm glass partition installation in a modern workspace"
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-7 order-1 lg:order-2"
            >
              <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-3">
                03. Our Approach
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101C35]">
                Listen first, plan around the site, and execute cleanly.
              </h2>
              <p className="mt-5 text-base text-slate-600 leading-[1.75]">
                No two rooms, storefronts, or floor plans behave identically. Rather than forcing
                one-size-fits-all templates, we discuss how you intend to use the space—whether it
                is natural ventilation through UPVC or aluminium windows, acoustic and visual
                clarity with 12 mm or 45x25 glass partitions, or coordinated gypsum ceilings and
                workstations.
              </p>
              <p className="mt-4 text-base text-slate-600 leading-[1.75]">
                From opening measurements to profile selection and final hardware alignment, our
                focus stays on clear communication and practical, site-ready execution.
              </p>
            </motion.div>
          </div>

          <div className="h-px bg-slate-200" />

          {/* 04. Our Commitment to Quality */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-3">
                04. Our Commitment to Quality
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101C35]">
                Quality shows in the joints, lines, and daily feel of the work.
              </h2>
              <p className="mt-5 text-base text-slate-600 leading-[1.75]">
                Good fabrication is experienced every time a sliding door glides cleanly, a glass
                partition aligns square from floor to ceiling, or a railing sits solid and crisp
                along a staircase. We emphasize clean finishing across every trade we deliver.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {WHY_CHOOSE_US_ITEMS.slice(0, 6).map((pillar) => (
                <div
                  key={pillar.index}
                  className="rounded-xl bg-[#F2F4F7] border border-slate-200/80 p-6"
                >
                  <span className="font-mono text-xs font-semibold text-[#1769FF] tabular-nums">
                    {pillar.index}
                  </span>
                  <h3 className="mt-2 font-display text-base font-bold text-[#101C35]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FinalCtaBanner />
    </div>
  );
}
