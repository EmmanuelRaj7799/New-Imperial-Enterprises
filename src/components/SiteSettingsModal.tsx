import React, { useEffect, useState } from 'react';
import { Check, Film, Mail, X } from 'lucide-react';
import {
  isSafeVideoUrl,
  isValidEmail,
  useSiteConfig,
  type VideoSlotConfig,
} from '../context/SiteConfigContext';

const VIDEO_SLOT_LABELS: Array<{ key: keyof VideoSlotConfig; label: string; suggestion: string }> = [
  { key: 'home', label: 'Homepage Hero Video', suggestion: '/videos/home-architecture.mp4' },
  { key: 'about', label: 'About Us Workshop Video', suggestion: '/videos/about-workshop.mp4' },
  { key: 'services', label: 'Services Montage Video', suggestion: '/videos/services-montage.mp4' },
  { key: 'gallery', label: 'Gallery Project Montage Video', suggestion: '/videos/gallery-montage.mp4' },
  { key: 'contact', label: 'Contact Interior Video', suggestion: '/videos/contact-interior.mp4' },
];

export function SiteSettingsModal() {
  const {
    businessEmail,
    setBusinessEmail,
    videos,
    setVideoUrl,
    isSettingsOpen,
    closeSettings,
  } = useSiteConfig();

  const [emailInput, setEmailInput] = useState(businessEmail);
  const [videoInputs, setVideoInputs] = useState<VideoSlotConfig>(videos);
  const [errorMsg, setErrorMsg] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (isSettingsOpen) {
      setEmailInput(businessEmail);
      setVideoInputs(videos);
      setErrorMsg('');
      setSavedNotice(false);
    }
  }, [isSettingsOpen, businessEmail, videos]);

  useEffect(() => {
    if (!isSettingsOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSettings();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSettingsOpen, closeSettings]);

  if (!isSettingsOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = emailInput.trim();
    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address or leave the email field blank.');
      return;
    }

    for (const slot of VIDEO_SLOT_LABELS) {
      const candidate = videoInputs[slot.key].trim();
      if (candidate && !isSafeVideoUrl(candidate)) {
        setErrorMsg(
          `Video URL for ${slot.label} must start with https:// or /videos/ (MP4 or WebM).`
        );
        return;
      }
    }

    setBusinessEmail(trimmedEmail);
    for (const slot of VIDEO_SLOT_LABELS) {
      setVideoUrl(slot.key, videoInputs[slot.key]);
    }
    setSavedNotice(true);
    window.setTimeout(() => {
      closeSettings();
    }, 650);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B12]/78 backdrop-blur-sm"
      onClick={closeSettings}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white text-[#101C35] shadow-2xl border border-slate-200"
      >
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <h2 id="site-settings-title" className="font-display text-lg font-bold text-[#101C35]">
              Site Email & Video Configuration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure your verified business email address and optional MP4/WebM hero videos.
            </p>
          </div>
          <button
            type="button"
            onClick={closeSettings}
            aria-label="Close settings"
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Editable Business Email Placeholder */}
          <div className="space-y-2">
            <label
              htmlFor="config-business-email"
              className="flex items-center gap-2 text-sm font-semibold text-[#101C35]"
            >
              <Mail className="w-4 h-4 text-[#1769FF]" aria-hidden="true" />
              <span>Business Email Address (Editable Placeholder)</span>
            </label>
            <input
              id="config-business-email"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your real business email address"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-[#101C35] focus:outline-none focus:border-[#1769FF]"
            />
            <p className="text-xs text-slate-500 leading-relaxed">
              Once a valid email is saved, clickable <code className="font-mono">mailto:</code>{' '}
              links activate automatically across the Contact page and Footer. For permanent
              deployment, also set <code className="font-mono">BUSINESS_EMAIL</code> in your
              environment configuration.
            </p>
          </div>

          <div className="h-px bg-slate-200" />

          {/* Video-Ready Hero Slots */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#101C35]">
              <Film className="w-4 h-4 text-[#1769FF]" aria-hidden="true" />
              <span>Background Video Slots (Optional MP4 / WebM)</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Each major page includes a video-ready hero section. Add a direct{' '}
              <code className="font-mono">https://</code> MP4/WebM URL or upload files into{' '}
              <code className="font-mono">/public/videos/</code>. When blank, high-resolution
              architectural photography is displayed cleanly.
            </p>

            <div className="space-y-3 pt-1">
              {VIDEO_SLOT_LABELS.map((slot) => (
                <div key={slot.key}>
                  <label
                    htmlFor={`video-${slot.key}`}
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    {slot.label}
                  </label>
                  <input
                    id={`video-${slot.key}`}
                    type="text"
                    value={videoInputs[slot.key]}
                    onChange={(e) =>
                      setVideoInputs((prev) => ({ ...prev, [slot.key]: e.target.value }))
                    }
                    placeholder={`e.g. ${slot.suggestion}`}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono text-[#101C35] focus:outline-none focus:border-[#1769FF]"
                  />
                </div>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700 font-medium"
            >
              {errorMsg}
            </div>
          )}

          {savedNotice && (
            <div
              role="status"
              className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs text-emerald-800 font-medium flex items-center gap-2"
            >
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>Site configuration updated.</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeSettings}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#1769FF] hover:bg-[#1458D6] text-white text-sm font-semibold cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
