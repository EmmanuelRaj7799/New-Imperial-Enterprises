import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bot,
  MessageCircle,
  Minimize2,
  Phone,
  Send,
  X,
} from 'lucide-react';
import { BUSINESS_INFO, buildWhatsAppUrl } from '../data/businessData';
import { useSiteConfig } from '../context/SiteConfigContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  suggestWhatsApp?: boolean;
  isError?: boolean;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'model',
  text: "Hello! Welcome to New Imperial Enterprises. I'm your virtual assistant. How can I help you today?",
};

const QUICK_REPLIES = [
  'Explore Services',
  'Aluminium Works',
  'Glass Works',
  'UPVC Windows',
  'Interior Works',
  'Contact Us',
  'Talk to Our Team',
];

export function ImperialChatbot() {
  const { businessEmail } = useSiteConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<'checking' | 'connected' | 'unconfigured'>('checking');
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    fetch('/api/chat/status')
      .then((res) => (res.ok ? res.json() : { configured: false }))
      .then((data: { configured?: boolean }) => {
        if (active) {
          setAiStatus(data.configured ? 'connected' : 'unconfigured');
        }
      })
      .catch(() => {
        if (active) {
          setAiStatus('unconfigured');
        }
      });
    return () => {
      active = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 180);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setIsLoading(true);

    try {
      const payloadMessages = nextHistory
        .filter((m) => m.id !== 'welcome' && !m.isError)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          configuredEmail: businessEmail || undefined,
        }),
      });

      const data = (await res.json()) as {
        reply?: string;
        suggestWhatsApp?: boolean;
        error?: string;
        code?: string;
      };

      if (!res.ok || !data.reply) {
        if (data.code === 'AI_NOT_CONFIGURED') {
          setAiStatus('unconfigured');
        }
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'model',
            text:
              data.error ||
              'Unable to reach the assistant right now. Please call 9700110084 or 7013248518, or connect on WhatsApp.',
            suggestWhatsApp: true,
            isError: true,
          },
        ]);
      } else {
        setAiStatus('connected');
        setMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            role: 'model',
            text: data.reply as string,
            suggestWhatsApp: Boolean(data.suggestWhatsApp),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `net-${Date.now()}`,
          role: 'model',
          text: 'Connection interrupted. Please call 9700110084 or 7013248518, or message us on WhatsApp directly.',
          suggestWhatsApp: true,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Imperial AI Assistant chat window"
            className="mb-3 w-[calc(100vw-2.5rem)] sm:w-[390px] max-h-[min(600px,calc(100vh-120px))] flex flex-col rounded-2xl overflow-hidden bg-[#080B12]/94 backdrop-blur-xl border border-white/15 shadow-[0_24px_70px_rgba(8,11,18,0.65)] text-white"
          >
            {/* Chat Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-[#101C35] to-[#0B1426] border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1769FF] to-[#00CFFF] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,207,255,0.28)]">
                  <Bot className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-sm font-bold text-white truncate">
                    Imperial AI Assistant
                  </h2>
                  <p className="text-xs text-[#C8D0DA]/80 truncate">
                    {aiStatus === 'unconfigured'
                      ? 'Awaiting AI backend configuration'
                      : 'New Imperial Enterprises'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Minimize chat"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#C8D0DA] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#C8D0DA] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Honest integration status notice if server key is absent */}
            {aiStatus === 'unconfigured' && (
              <div className="px-4 py-3 bg-[#D6B36A]/15 border-b border-[#D6B36A]/30 text-xs text-[#F3E2BC] leading-relaxed">
                Live AI chat is awaiting server-side Gemini API configuration. In the meantime, you
                can connect directly with our team by phone or WhatsApp below.
              </div>
            )}

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 min-h-[240px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[86%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-[#1769FF] text-white rounded-br-sm'
                        : msg.isError
                          ? 'bg-red-950/60 border border-red-400/30 text-red-100 rounded-bl-sm'
                          : 'bg-white/8 border border-white/10 text-[#E5EAF1] rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.suggestWhatsApp && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <a
                        href={buildWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Chat on WhatsApp</span>
                      </a>
                      <a
                        href={BUSINESS_INFO.phones[0].href}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#00CFFF]" aria-hidden="true" />
                        <span className="font-mono tabular-nums">{BUSINESS_INFO.phones[0].display}</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start">
                  <div
                    aria-label="Imperial AI Assistant is typing"
                    className="rounded-2xl rounded-bl-sm px-4 py-3 bg-white/8 border border-white/10 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00CFFF] animate-bounce [animation-delay:-0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00CFFF] animate-bounce [animation-delay:-0.1s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00CFFF] animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={scrollEndRef} />
            </div>

            {/* Quick Reply Buttons */}
            <div className="px-4 py-2.5 border-t border-white/8 bg-white/[0.02]">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {QUICK_REPLIES.map((label) => (
                  <button
                    key={label}
                    type="button"
                    disabled={isLoading || aiStatus === 'unconfigured'}
                    onClick={() => void sendMessage(label)}
                    className="px-3 py-1.5 rounded-lg bg-white/6 hover:bg-[#1769FF]/25 border border-white/12 text-xs font-medium text-[#E5EAF1] hover:text-white transition-colors whitespace-nowrap shrink-0 disabled:opacity-45 cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-[#0B1221] border-t border-white/10 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || aiStatus === 'unconfigured'}
                placeholder={
                  aiStatus === 'unconfigured'
                    ? 'Awaiting AI configuration...'
                    : 'Ask about aluminium, glass, UPVC, ceilings...'
                }
                maxLength={1000}
                className="flex-1 min-w-0 bg-white/6 border border-white/12 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-[#C8D0DA]/55 focus:outline-none focus:border-[#00CFFF] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || aiStatus === 'unconfigured'}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl bg-[#1769FF] hover:bg-[#1458D6] disabled:opacity-45 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating Circular Chatbot Launcher Button (Bottom-Left, away from WhatsApp) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close Imperial AI Assistant' : 'Open Imperial AI Assistant'}
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2.5 h-[52px] px-4 sm:px-5 rounded-full bg-gradient-to-r from-[#1769FF] to-[#00A8E8] hover:from-[#1458D6] hover:to-[#0092CC] text-white shadow-[0_12px_32px_rgba(23,105,255,0.42)] border border-white/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00CFFF]"
      >
        {isOpen ? (
          <X className="w-5 h-5 shrink-0" aria-hidden="true" />
        ) : (
          <Bot className="w-5 h-5 shrink-0" aria-hidden="true" />
        )}
        <span className="hidden sm:inline text-sm font-semibold tracking-tight whitespace-nowrap">
          Imperial AI
        </span>
      </button>
    </div>
  );
}
