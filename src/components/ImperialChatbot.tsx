import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Mail,
  MessageCircle,
  MessageSquareText,
  Minus,
  Phone,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';
import { BUSINESS_INFO, buildWhatsAppUrl } from '../data/businessData';
import {
  INITIAL_QUICK_QUESTIONS,
  getChatbotReply,
  type BotActionLink,
} from '../data/chatbotKnowledge';
import { useSiteConfig } from '../context/SiteConfigContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  links?: BotActionLink[];
  showContactActions?: boolean;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  text: `Welcome to ${BUSINESS_INFO.displayName}. I'm your instant project guide — ask me about our aluminium works, glass partitions, UPVC windows & doors, ceilings, railings, ACP cladding, or quotation process.`,
};

export function ImperialChatbot() {
  const { businessEmail } = useSiteConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(INITIAL_QUICK_QUESTIONS);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scrollEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const replyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 160);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (replyTimerRef.current !== null) {
        window.clearTimeout(replyTimerRef.current);
      }
    };
  }, []);

  const handleSend = (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const delayMs = prefersReducedMotion ? 0 : 240;

    replyTimerRef.current = window.setTimeout(() => {
      const response = getChatbotReply(trimmed, businessEmail);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          role: 'bot',
          text: response.text,
          links: response.links,
          showContactActions: response.showContactActions,
        },
      ]);
      if (response.followUps && response.followUps.length > 0) {
        setSuggestedQuestions(response.followUps);
      }
      setIsTyping(false);
      replyTimerRef.current = null;
    }, delayMs);
  };

  const handleReset = () => {
    if (replyTimerRef.current !== null) {
      window.clearTimeout(replyTimerRef.current);
      replyTimerRef.current = null;
    }
    setIsTyping(false);
    setMessages([WELCOME_MESSAGE]);
    setSuggestedQuestions(INITIAL_QUICK_QUESTIONS);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const activeEmail = businessEmail || BUSINESS_INFO.email;

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            aria-label="New Imperial Enterprises Assistant"
            className="mb-3 w-[calc(100vw-2.5rem)] sm:w-[392px] max-h-[min(600px,calc(100vh-116px))] flex flex-col rounded-2xl overflow-hidden bg-[#080B12] border border-white/15 shadow-[0_24px_70px_rgba(8,11,18,0.72)] text-white"
          >
            {/* Architectural Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-[#101C35] via-[#0E182D] to-[#0B1221] border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 border border-[#D6B36A]/45">
                  <img
                    src={BUSINESS_INFO.logoPath}
                    alt="New Imperial Enterprises"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-sm font-bold text-white tracking-tight truncate">
                    Imperial Assistant
                  </h2>
                  <p className="text-[11px] text-[#D6B36A] truncate">
                    Instant Service &amp; Enquiry Guide
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset conversation"
                  title="Restart conversation"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#C8D0DA] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Minimize assistant"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#C8D0DA] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close assistant"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#C8D0DA] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 min-h-[240px] bg-[radial-gradient(ellipse_at_top,rgba(23,105,255,0.08),transparent_55%)]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.6] whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-[#1769FF] text-white rounded-br-sm shadow-[0_6px_20px_rgba(23,105,255,0.28)]'
                        : 'bg-[#101C35]/90 border border-white/10 text-[#E6ECF5] rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Page Deep-Links */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {msg.links.map((link) => (
                        <Link
                          key={`${msg.id}-${link.to}`}
                          to={link.to}
                          onClick={() => {
                            if (window.innerWidth < 640) setIsOpen(false);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1769FF]/18 hover:bg-[#1769FF] border border-[#00CFFF]/35 text-xs font-semibold text-[#E6F7FF] hover:text-white transition-colors whitespace-nowrap"
                        >
                          <span>{link.label}</span>
                          <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Direct Contact Action Strip */}
                  {msg.showContactActions && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <a
                        href={buildWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                      >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={BUSINESS_INFO.phones[0].href}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 border border-white/12 text-white text-xs font-medium transition-colors whitespace-nowrap"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#00CFFF] shrink-0" aria-hidden="true" />
                        <span className="font-mono tabular-nums">
                          {BUSINESS_INFO.phones[0].display}
                        </span>
                      </a>
                      <a
                        href={`mailto:${activeEmail}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 border border-white/12 text-white text-xs font-medium transition-colors whitespace-nowrap"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#D6B36A] shrink-0" aria-hidden="true" />
                        <span>Email</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start">
                  <div
                    aria-label="Imperial Assistant is responding"
                    className="rounded-2xl rounded-bl-sm px-4 py-3 bg-[#101C35]/90 border border-white/10 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00CFFF] animate-bounce [animation-delay:-0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00CFFF] animate-bounce [animation-delay:-0.1s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00CFFF] animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={scrollEndRef} />
            </div>

            {/* Clean Quick Topic Chips (No harsh native scrollbar) */}
            <div className="px-3.5 py-2.5 border-t border-white/10 bg-[#0B1221]">
              <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    disabled={isTyping}
                    onClick={() => handleSend(question)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-[#1769FF]/25 border border-white/12 hover:border-[#00CFFF]/45 text-xs font-medium text-[#DCE3EE] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-[#080B12] border-t border-white/10 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                placeholder="Ask about aluminium, glass, UPVC, ceilings..."
                maxLength={500}
                className="flex-1 min-w-0 bg-white/[0.06] border border-white/14 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-[#C8D0DA]/50 focus:outline-none focus:border-[#00CFFF] transition-colors"
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl bg-[#1769FF] hover:bg-[#1458D6] disabled:opacity-45 text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Premium Architectural Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close Imperial Assistant' : 'Open Imperial Assistant'}
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2.5 h-[50px] px-4 sm:px-5 rounded-full bg-gradient-to-r from-[#101C35] via-[#1769FF] to-[#0099DB] hover:brightness-110 text-white shadow-[0_12px_30px_rgba(23,105,255,0.38)] border border-white/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00CFFF]"
      >
        {isOpen ? (
          <X className="w-5 h-5 shrink-0" aria-hidden="true" />
        ) : (
          <MessageSquareText className="w-5 h-5 shrink-0" aria-hidden="true" />
        )}
        <span className="hidden sm:inline text-sm font-semibold tracking-tight whitespace-nowrap">
          Ask Imperial
        </span>
      </button>
    </div>
  );
}
