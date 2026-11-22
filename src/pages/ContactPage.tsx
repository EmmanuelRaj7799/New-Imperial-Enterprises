import React, { useState } from 'react';
import {
  CheckCircle2,
  FileText,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Settings2,
} from 'lucide-react';
import { CinematicHero } from '../components/CinematicHero';
import { FaqAccordion } from '../components/FaqAccordion';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSiteConfig } from '../context/SiteConfigContext';
import {
  BUSINESS_INFO,
  ENQUIRY_SERVICE_OPTIONS,
  IMAGES,
  buildWhatsAppUrl,
} from '../data/businessData';

interface FormState {
  fullName: string;
  mobileNumber: string;
  email: string;
  serviceRequired: string;
  projectLocation: string;
  message: string;
}

const INITIAL_FORM: FormState = {
  fullName: '',
  mobileNumber: '',
  email: '',
  serviceRequired: ENQUIRY_SERVICE_OPTIONS[0],
  projectLocation: '',
  message: '',
};

export function ContactPage() {
  usePageMeta({
    title: 'Contact Us | New Imperial Enterprises',
    description:
      'Contact New Imperial Enterprises on 9700110084 or 7013248518, message us on WhatsApp, or submit your architectural fabrication and interior enquiry online.',
  });

  const { businessEmail, openSettings } = useSiteConfig();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<{
    referenceId: string;
    serviceRequired: string;
    fullName: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const fullName = form.fullName.trim();
    const mobileNumber = form.mobileNumber.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (fullName.length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const digits = mobileNumber.replace(/[\s\-()+]/g, '');
    if (!/^\d{10,15}$/.test(digits)) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address or leave the email field empty.');
      return;
    }

    if (message.length < 5) {
      setErrorMsg('Please share a brief description of your project or requirement.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          mobileNumber,
          email,
          serviceRequired: form.serviceRequired,
          projectLocation: form.projectLocation.trim(),
          message,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        referenceId?: string;
        error?: string;
      };

      if (!res.ok || !data.success || !data.referenceId) {
        setErrorMsg(
          data.error ||
            'Could not submit your enquiry right now. Please call 9700110084 or connect on WhatsApp.'
        );
        return;
      }

      setSubmittedRecord({
        referenceId: data.referenceId,
        serviceRequired: form.serviceRequired,
        fullName,
      });
      setForm(INITIAL_FORM);
    } catch {
      setErrorMsg(
        'Network error while submitting your enquiry. You can call 9700110084 or message us on WhatsApp directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* VIDEO-READY ARCHITECTURAL INTERIOR HERO */}
      <CinematicHero
        videoSlot="contact"
        posterSrc={IMAGES.blackCurtains}
        posterAlt="Sophisticated modern executive architectural interior with dark glass windows and floor-to-ceiling curtains"
        minHeightClass="min-h-[60vh]"
      >
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#D6B36A] mb-4">
            Contact {BUSINESS_INFO.name}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.03em] leading-[1.1] text-white">
            Let&apos;s Talk About Your Next Project.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[#C8D0DA] leading-relaxed max-w-2xl">
            Call directly, message us on WhatsApp, or share your requirements through the enquiry
            form below to discuss your space and material possibilities.
          </p>
        </div>
      </CinematicHero>

      {/* CONTACT DETAILS + WORKING ENQUIRY FORM */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
            {/* Left Column: Direct Verified Business Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl bg-[#101C35] text-white p-8 border border-white/10">
                <div className="flex items-center gap-3.5 pb-6 border-b border-white/12">
                  <span className="h-12 w-12 rounded-lg bg-white p-1.5 flex items-center justify-center shrink-0">
                    <img
                      src={BUSINESS_INFO.logoPath}
                      alt="New Imperial Enterprises logo"
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-bold tracking-[0.05em] text-white">
                      {BUSINESS_INFO.name}
                    </h2>
                    <p className="text-xs text-[#D6B36A] mt-0.5">{BUSINESS_INFO.tagline}</p>
                  </div>
                </div>

                <div className="mt-7 space-y-6">
                  {/* Phone 1 & Phone 2 */}
                  <div>
                    <div className="text-xs font-medium text-[#C8D0DA]/70 mb-2.5">
                      Direct Phone Numbers
                    </div>
                    <div className="space-y-2.5">
                      {BUSINESS_INFO.phones.map((phone, i) => (
                        <a
                          key={phone.display}
                          href={phone.href}
                          className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-[#00CFFF] shrink-0" aria-hidden="true" />
                            <span className="font-mono text-base font-semibold text-white tabular-nums">
                              {phone.display}
                            </span>
                          </div>
                          <span className="text-xs text-[#C8D0DA]/75">Phone {i + 1} · Call</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <div className="text-xs font-medium text-[#C8D0DA]/70 mb-2.5">
                      WhatsApp Direct Enquiry
                    </div>
                    <a
                      href={buildWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Start WhatsApp Conversation</span>
                    </a>
                  </div>

                  {/* Editable Email Placeholder / Active Mailto */}
                  <div className="pt-5 border-t border-white/12">
                    <div className="text-xs font-medium text-[#C8D0DA]/70 mb-2">Email Address</div>
                    {businessEmail ? (
                      <div className="flex items-center justify-between gap-3">
                        <a
                          href={`mailto:${businessEmail}`}
                          className="inline-flex items-center gap-2.5 text-sm font-medium text-white hover:text-[#00CFFF] break-all"
                        >
                          <Mail className="w-4 h-4 text-[#00CFFF] shrink-0" aria-hidden="true" />
                          <span>{businessEmail}</span>
                        </a>
                        <button
                          type="button"
                          onClick={openSettings}
                          className="text-xs text-[#C8D0DA]/75 hover:text-white underline cursor-pointer shrink-0"
                        >
                          Edit
                        </button>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-white/[0.04] border border-dashed border-white/20 p-4">
                        <p className="text-xs text-[#C8D0DA]/85 leading-relaxed">
                          Email address placeholder is ready to be configured. Once added, it
                          automatically activates as a clickable <code className="font-mono">mailto:</code>{' '}
                          link across the site.
                        </p>
                        <button
                          type="button"
                          onClick={openSettings}
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#00CFFF] hover:text-white cursor-pointer"
                        >
                          <Settings2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Configure Business Email</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* GSTIN */}
                  <div className="pt-5 border-t border-white/12 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-[#C8D0DA]/75">
                      <FileText className="w-4 h-4 text-[#D6B36A]" aria-hidden="true" />
                      <span>GSTIN</span>
                    </div>
                    <span className="font-mono text-sm font-semibold text-white tabular-nums">
                      {BUSINESS_INFO.gstin}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Validated Contact Enquiry Form */}
            <div
              id="enquiry-form"
              className="lg:col-span-7 rounded-2xl bg-[#F2F4F7] border border-slate-200 p-7 sm:p-10 scroll-mt-24"
            >
              <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-2">
                Project Enquiry
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#101C35]">
                Tell us about your requirements.
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Complete the fields below and our team will contact you to discuss your project.
              </p>

              {submittedRecord ? (
                <div
                  role="status"
                  className="mt-8 rounded-2xl bg-white border border-emerald-200 p-7 space-y-4"
                >
                  <div className="flex items-center gap-3 text-emerald-700">
                    <CheckCircle2 className="w-6 h-6 shrink-0" aria-hidden="true" />
                    <h3 className="font-display text-xl font-bold text-[#101C35]">
                      Enquiry Received
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Thank you, <strong className="text-[#101C35]">{submittedRecord.fullName}</strong>.
                    Your enquiry for{' '}
                    <strong className="text-[#101C35]">{submittedRecord.serviceRequired}</strong>{' '}
                    has been recorded. Our team will review your message and contact you directly.
                  </p>
                  <div className="rounded-lg bg-[#F2F4F7] px-4 py-3 text-xs text-slate-700 flex items-center justify-between gap-4">
                    <span>Reference Number</span>
                    <span className="font-mono font-semibold text-[#101C35] tabular-nums">
                      {submittedRecord.referenceId}
                    </span>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a
                      href={buildWhatsAppUrl(
                        `Hello New Imperial Enterprises, I just submitted enquiry ${submittedRecord.referenceId} regarding ${submittedRecord.serviceRequired}. Please contact me.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      <span>Follow Up on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmittedRecord(null)}
                      className="px-4 py-3 rounded-lg border border-slate-300 text-sm font-semibold text-[#101C35] hover:bg-slate-50 cursor-pointer"
                    >
                      Send Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-semibold text-[#101C35] mb-1.5"
                      >
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full rounded-lg bg-white border border-slate-300 px-4 py-3 text-sm text-[#101C35] placeholder:text-slate-400 focus:outline-none focus:border-[#1769FF]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="mobileNumber"
                        className="block text-sm font-semibold text-[#101C35] mb-1.5"
                      >
                        Mobile Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="mobileNumber"
                        name="mobileNumber"
                        type="tel"
                        required
                        value={form.mobileNumber}
                        onChange={handleChange}
                        placeholder="e.g. 9700110084"
                        className="w-full rounded-lg bg-white border border-slate-300 px-4 py-3 text-sm font-mono text-[#101C35] placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:border-[#1769FF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-[#101C35] mb-1.5"
                      >
                        Email Address <span className="text-xs font-normal text-slate-500">(Optional)</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full rounded-lg bg-white border border-slate-300 px-4 py-3 text-sm text-[#101C35] placeholder:text-slate-400 focus:outline-none focus:border-[#1769FF]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="projectLocation"
                        className="block text-sm font-semibold text-[#101C35] mb-1.5"
                      >
                        Project Location{' '}
                        <span className="text-xs font-normal text-slate-500">(Optional)</span>
                      </label>
                      <input
                        id="projectLocation"
                        name="projectLocation"
                        type="text"
                        value={form.projectLocation}
                        onChange={handleChange}
                        placeholder="Area or city"
                        className="w-full rounded-lg bg-white border border-slate-300 px-4 py-3 text-sm text-[#101C35] placeholder:text-slate-400 focus:outline-none focus:border-[#1769FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="serviceRequired"
                      className="block text-sm font-semibold text-[#101C35] mb-1.5"
                    >
                      Service Required <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="serviceRequired"
                      name="serviceRequired"
                      required
                      value={form.serviceRequired}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-white border border-slate-300 px-4 py-3 text-sm text-[#101C35] focus:outline-none focus:border-[#1769FF]"
                    >
                      {ENQUIRY_SERVICE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-[#101C35] mb-1.5"
                    >
                      Message <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Share your space type, required work, or any questions for our team..."
                      className="w-full rounded-lg bg-white border border-slate-300 px-4 py-3 text-sm text-[#101C35] placeholder:text-slate-400 focus:outline-none focus:border-[#1769FF] resize-y"
                    />
                  </div>

                  {errorMsg && (
                    <div
                      role="alert"
                      className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium"
                    >
                      {errorMsg}
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#1769FF] hover:bg-[#1458D6] disabled:opacity-60 text-white text-sm font-semibold tracking-[0.04em] transition-colors btn-metallic-sheen cursor-pointer"
                    >
                      <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{submitting ? 'SUBMITTING...' : 'SUBMIT ENQUIRY'}</span>
                    </button>

                    <span className="text-xs text-slate-500">
                      Prefer calling?{' '}
                      <a
                        href={BUSINESS_INFO.phones[0].href}
                        className="font-mono font-semibold text-[#101C35] hover:text-[#1769FF] tabular-nums"
                      >
                        {BUSINESS_INFO.phones[0].display}
                      </a>
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-[#F2F4F7] py-20 border-t border-slate-200/70">
        <div className="max-w-[1000px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#1769FF] mb-2">
              Quick Answers
            </p>
            <h2 className="font-display text-3xl font-bold text-[#101C35]">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 px-6 sm:px-8 py-2">
            <FaqAccordion />
          </div>
        </div>
      </section>
    </div>
  );
}
