import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Phone } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSiteConfig } from '../context/SiteConfigContext';
import { BUSINESS_INFO, buildWhatsAppUrl } from '../data/businessData';

export function PrivacyPolicyPage() {
  usePageMeta({
    title: 'Privacy Policy | New Imperial Enterprises',
    description:
      'Privacy Policy explaining how New Imperial Enterprises handles customer enquiry details, phone, email (amju620@gmail.com), and WhatsApp communication.',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Privacy Policy', path: '/privacy-policy' },
    ],
  });

  const { businessEmail } = useSiteConfig();

  return (
    <div className="bg-white pt-28 pb-24">
      <div className="max-w-[860px] mx-auto px-6 sm:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#1769FF] hover:underline mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to Home</span>
        </Link>

        <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-3">
          Legal &amp; Privacy
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#101C35]">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-slate-500">
          {BUSINESS_INFO.name} · GSTIN:{' '}
          <span className="font-mono text-[#101C35] tabular-nums">{BUSINESS_INFO.gstin}</span>
        </p>

        <div className="mt-10 pt-8 border-t border-slate-200 space-y-8 text-[15px] text-slate-600 leading-[1.78]">
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#101C35]">
              1. Information You Voluntarily Provide
            </h2>
            <p>
              When you submit an enquiry through our Contact Us form or communicate with{' '}
              {BUSINESS_INFO.displayName} by phone, WhatsApp, or email, you may share details such
              as your full name, mobile number, optional email address, required service category,
              optional project location, and project description.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#101C35]">
              2. How We Use Your Enquiry Information
            </h2>
            <p>
              Information submitted to {BUSINESS_INFO.displayName} is used solely to understand
              your aluminium fabrication, glass, UPVC, ceiling, railing, ACP, metal, or interior
              work requirements, respond to your questions, coordinate project discussions, and
              provide relevant follow-up communication. We do not sell or rent customer contact
              details to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#101C35]">
              3. WhatsApp &amp; External Communication Channels
            </h2>
            <p>
              Clicking a WhatsApp button opens a conversation with our official business number on
              WhatsApp. Your use of WhatsApp is governed by WhatsApp&apos;s own privacy policy and
              terms of service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-[#101C35]">
              4. Data Retention &amp; Contact Requests
            </h2>
            <p>
              We retain enquiry records only as needed to respond to project requests and maintain
              legitimate business records. If you wish to update or remove enquiry details you
              submitted, please contact us directly using the details below.
            </p>
          </section>

          <section className="rounded-2xl bg-[#F2F4F7] border border-slate-200 p-6 space-y-3">
            <h2 className="font-display text-lg font-bold text-[#101C35]">
              Contact {BUSINESS_INFO.displayName}
            </h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {BUSINESS_INFO.phones.map((phone) => (
                <a
                  key={phone.display}
                  href={phone.href}
                  className="inline-flex items-center gap-2 font-mono font-semibold text-[#101C35] hover:text-[#1769FF] tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#1769FF]" aria-hidden="true" />
                  <span>{phone.display}</span>
                </a>
              ))}
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-[#15803D] hover:underline"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
              {businessEmail && (
                <a
                  href={`mailto:${businessEmail}`}
                  className="inline-flex items-center gap-2 font-medium text-[#101C35] hover:text-[#1769FF]"
                >
                  <Mail className="w-4 h-4 text-[#1769FF]" aria-hidden="true" />
                  <span>{businessEmail}</span>
                </a>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
