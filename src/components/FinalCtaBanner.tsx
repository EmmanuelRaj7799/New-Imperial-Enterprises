import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { BUSINESS_INFO, buildWhatsAppUrl } from '../data/businessData';

interface FinalCtaBannerProps {
  heading?: string;
  description?: string;
  whatsAppMessage?: string;
}

export function FinalCtaBanner({
  heading = "Have a Project in Mind? Let's Build Something Exceptional.",
  description = 'Speak directly with New Imperial Enterprises to discuss aluminium fabrication, glass partitions, UPVC windows, ceilings, railings, ACP cladding, or customized interior works.',
  whatsAppMessage,
}: FinalCtaBannerProps) {
  return (
    <section className="relative overflow-hidden bg-[#080B12] text-white py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(23,105,255,0.22),transparent_48%),radial-gradient(circle_at_15%_85%,rgba(214,179,106,0.12),transparent_42%)]"
      />
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="text-xs font-medium tracking-[0.14em] text-[#D6B36A] mb-4">
            Start a Conversation
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.15] text-white">
            {heading}
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#C8D0DA] leading-relaxed max-w-2xl">
            {description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={BUSINESS_INFO.phones[0].href}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#1769FF] hover:bg-[#1458D6] text-white text-sm font-semibold transition-colors btn-metallic-sheen whitespace-nowrap"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Call Now · {BUSINESS_INFO.phones[0].display}</span>
            </a>

            <a
              href={buildWhatsAppUrl(whatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>WhatsApp Us</span>
            </a>

            <Link
              to="/contact#enquiry-form"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg border border-white/20 hover:border-white/45 text-white text-sm font-medium transition-colors whitespace-nowrap"
            >
              <span>Send Enquiry Form</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
