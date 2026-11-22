import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../data/businessData';

export function FloatingWhatsApp() {
  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with New Imperial Enterprises on WhatsApp"
      className="fixed bottom-5 right-5 z-40 group inline-flex items-center gap-2.5 h-[52px] px-4 sm:px-5 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white shadow-[0_12px_32px_rgba(22,163,74,0.38)] border border-white/15 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00CFFF]"
    >
      <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline text-sm font-semibold tracking-tight whitespace-nowrap">
        WhatsApp
      </span>
    </a>
  );
}
