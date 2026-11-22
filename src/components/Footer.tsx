import { Link } from 'react-router-dom';
import { ArrowUp, Mail, MessageCircle, Phone, Settings2 } from 'lucide-react';
import { BUSINESS_INFO, SERVICE_CATEGORIES, buildWhatsAppUrl } from '../data/businessData';
import { useSiteConfig } from '../context/SiteConfigContext';

export function Footer() {
  const { businessEmail, openSettings } = useSiteConfig();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080B12] text-[#C8D0DA] border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Column 1: Brand & Overview */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3.5">
              <span className="h-11 w-11 rounded-lg bg-white p-1.5 flex items-center justify-center shrink-0">
                <img
                  src={BUSINESS_INFO.logoPath}
                  alt="New Imperial Enterprises logo"
                  className="h-full w-full object-contain"
                />
              </span>
              <div>
                <div className="font-display text-base font-bold tracking-[0.06em] text-white">
                  {BUSINESS_INFO.name}
                </div>
                <div className="text-xs text-[#D6B36A] mt-0.5">{BUSINESS_INFO.tagline}</div>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-[#C8D0DA]/80 max-w-sm">
              Delivering architectural aluminium fabrication, glass partitions, UPVC windows and
              doors, gypsum & grid ceilings, railings, ACP cladding, and customized interior
              solutions for modern residential and commercial spaces.
            </p>

            <div className="pt-1 text-xs text-[#C8D0DA]/75 space-y-1">
              <div>
                <span className="text-[#C8D0DA]/60">GSTIN: </span>
                <span className="font-mono text-white tabular-nums">{BUSINESS_INFO.gstin}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Services Overview
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition-colors">
                  Gallery / Our Work
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Major Services */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-sm font-semibold text-white mb-4">Our Services</h3>
            <ul className="space-y-2.5 text-sm">
              {SERVICE_CATEGORIES.map((service) => (
                <li key={service.slug}>
                  <Link to={service.route} className="hover:text-white transition-colors">
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/services#additional-services"
                  className="hover:text-white transition-colors"
                >
                  Additional Services & Custom Work
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display text-sm font-semibold text-white">Direct Contact</h3>

            <div className="space-y-2.5 text-sm">
              {BUSINESS_INFO.phones.map((phone) => (
                <a
                  key={phone.display}
                  href={phone.href}
                  className="flex items-center gap-2.5 text-white hover:text-[#00CFFF] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#00CFFF] shrink-0" aria-hidden="true" />
                  <span className="font-mono tabular-nums">{phone.display}</span>
                </a>
              ))}

              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[#86EFAC] hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>WhatsApp Enquiry</span>
              </a>

              {businessEmail ? (
                <a
                  href={`mailto:${businessEmail}`}
                  className="flex items-center gap-2.5 text-white hover:text-[#00CFFF] transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-[#00CFFF] shrink-0" aria-hidden="true" />
                  <span>{businessEmail}</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={openSettings}
                  className="inline-flex items-center gap-2 text-xs text-[#C8D0DA]/70 hover:text-white transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D6B36A]" aria-hidden="true" />
                  <span className="underline underline-offset-4">
                    Add business email address
                  </span>
                </button>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={openSettings}
                className="inline-flex items-center gap-2 text-xs text-[#C8D0DA]/65 hover:text-white transition-colors cursor-pointer"
              >
                <Settings2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Site Email & Video Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C8D0DA]/65 pb-14 sm:pb-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            <span>
              © {new Date().getFullYear()} {BUSINESS_INFO.displayName}. All rights reserved.
            </span>
            <span aria-hidden="true">·</span>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/12 text-[#C8D0DA] hover:text-white hover:border-white/30 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
