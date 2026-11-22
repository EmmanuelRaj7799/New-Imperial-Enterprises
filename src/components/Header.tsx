import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import { BUSINESS_INFO, SERVICE_CATEGORIES, buildWhatsAppUrl } from '../data/businessData';

export function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Privacy policy has a light header area; all other pages start with a dark cinematic hero
  const isLightTopPage = location.pathname === '/privacy-policy';
  const useSolidNav = scrolled || isLightTopPage || mobileMenuOpen;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 28);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setServicesOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const isServiceActive = location.pathname.startsWith('/services');

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        useSolidNav
          ? 'bg-[#101C35]/96 backdrop-blur-md border-b border-white/10 shadow-[0_8px_30px_rgba(8,11,18,0.22)]'
          : 'bg-gradient-to-b from-[#080B12]/72 to-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 h-[72px] flex items-center justify-between gap-8">
        {/* Zone 1: Brand Identity (Single-line lockup, zero descriptors/chips) */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00CFFF]"
          aria-label="New Imperial Enterprises Home"
        >
          <span className="h-9 w-9 rounded-md bg-white p-1 flex items-center justify-center shrink-0 shadow-sm">
            <img
              src={BUSINESS_INFO.logoPath}
              alt="New Imperial Enterprises emblem"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="font-display text-[15px] sm:text-base font-bold tracking-[0.06em] text-white whitespace-nowrap shrink-0">
            NEW IMPERIAL ENTERPRISES
          </span>
        </Link>

        {/* Zone 2: Desktop Navigation (Clean typography links, 5 items) */}
        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              location.pathname === '/'
                ? 'text-white border-[#00CFFF]'
                : 'text-[#C8D0DA] border-transparent hover:text-white hover:border-white/40'
            }`}
          >
            Home
          </Link>

          <Link
            to="/about"
            className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              location.pathname === '/about'
                ? 'text-white border-[#00CFFF]'
                : 'text-[#C8D0DA] border-transparent hover:text-white hover:border-white/40'
            }`}
          >
            About
          </Link>

          {/* Services Dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              onClick={() => setServicesOpen((prev) => !prev)}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                isServiceActive
                  ? 'text-white border-[#00CFFF]'
                  : 'text-[#C8D0DA] border-transparent hover:text-white hover:border-white/40'
              }`}
            >
              <span>Services</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  servicesOpen ? 'rotate-180 text-[#00CFFF]' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {servicesOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[340px]">
                <div className="rounded-xl bg-[#080B12]/98 backdrop-blur-xl border border-white/12 shadow-[0_24px_60px_rgba(0,0,0,0.55)] p-2">
                  <Link
                    to="/services"
                    onClick={() => setServicesOpen(false)}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === '/services'
                        ? 'bg-[#1769FF]/20 text-white'
                        : 'text-white hover:bg-white/6'
                    }`}
                  >
                    <div className="text-sm font-semibold">All Services Overview</div>
                    <div className="text-xs text-[#C8D0DA]/80 mt-0.5">
                      Explore complete fabrication & interior solutions
                    </div>
                  </Link>

                  <div className="my-1.5 h-px bg-white/10" />

                  <div className="space-y-0.5">
                    {SERVICE_CATEGORIES.map((service) => (
                      <Link
                        key={service.slug}
                        to={service.route}
                        onClick={() => setServicesOpen(false)}
                        className={`flex items-baseline justify-between gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                          location.pathname === service.route
                            ? 'bg-[#1769FF]/20 text-white font-medium'
                            : 'text-[#C8D0DA] hover:text-white hover:bg-white/6'
                        }`}
                      >
                        <span>{service.title}</span>
                        <span className="font-mono text-[11px] text-[#D6B36A]/80 tabular-nums">
                          {service.index}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/gallery"
            className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              location.pathname === '/gallery'
                ? 'text-white border-[#00CFFF]'
                : 'text-[#C8D0DA] border-transparent hover:text-white hover:border-white/40'
            }`}
          >
            Gallery
          </Link>

          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              location.pathname === '/contact'
                ? 'text-white border-[#00CFFF]'
                : 'text-[#C8D0DA] border-transparent hover:text-white hover:border-white/40'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Zone 3: Single Primary Action CTA + Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/contact#enquiry-form"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#1769FF] hover:bg-[#1458D6] text-white text-sm font-semibold tracking-tight transition-colors whitespace-nowrap shrink-0 btn-metallic-sheen focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00CFFF]"
          >
            Get a Quote
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#080B12] border-t border-white/10 max-h-[calc(100vh-72px)] overflow-y-auto">
          <nav aria-label="Mobile Navigation" className="px-6 py-6 space-y-1">
            <Link
              to="/"
              className="block py-3 text-base font-medium text-white border-b border-white/8"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block py-3 text-base font-medium text-white border-b border-white/8"
            >
              About Us
            </Link>

            <div className="border-b border-white/8">
              <button
                type="button"
                onClick={() => setMobileServicesOpen((prev) => !prev)}
                className="w-full py-3 flex items-center justify-between text-base font-medium text-white cursor-pointer"
                aria-expanded={mobileServicesOpen}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#C8D0DA] transition-transform ${
                    mobileServicesOpen ? 'rotate-180 text-[#00CFFF]' : ''
                  }`}
                />
              </button>
              {mobileServicesOpen && (
                <div className="pb-3 pl-4 space-y-1">
                  <Link
                    to="/services"
                    className="block py-2.5 text-sm font-medium text-[#00CFFF]"
                  >
                    All Services Overview
                  </Link>
                  {SERVICE_CATEGORIES.map((service) => (
                    <Link
                      key={service.slug}
                      to={service.route}
                      className="block py-2.5 text-sm text-[#C8D0DA] hover:text-white"
                    >
                      {service.index}. {service.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/gallery"
              className="block py-3 text-base font-medium text-white border-b border-white/8"
            >
              Gallery / Our Work
            </Link>
            <Link
              to="/contact"
              className="block py-3 text-base font-medium text-white border-b border-white/8"
            >
              Contact Us
            </Link>

            <div className="pt-5 space-y-3">
              <Link
                to="/contact#enquiry-form"
                className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-lg bg-[#1769FF] text-white text-sm font-semibold"
              >
                Get a Quote
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={BUSINESS_INFO.phones[0].href}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/15 text-sm font-medium text-white hover:bg-white/5"
                >
                  <Phone className="w-4 h-4 text-[#00CFFF]" aria-hidden="true" />
                  <span className="font-mono text-xs tabular-nums">{BUSINESS_INFO.phones[0].display}</span>
                </a>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-3 rounded-lg bg-[#25D366]/15 border border-[#25D366]/35 text-sm font-medium text-[#86EFAC]"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
