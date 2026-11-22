import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { FAQ_ITEMS, type FaqItem } from '../data/businessData';

interface FaqAccordionProps {
  items?: FaqItem[];
  dark?: boolean;
}

export function FaqAccordion({ items = FAQ_ITEMS, dark = false }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-200/80 border-y border-slate-200/80">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={item.question} className={dark ? 'border-white/10' : ''}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="w-full py-5 sm:py-6 flex items-center justify-between gap-6 text-left cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769FF]"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-[#1769FF] tabular-nums shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span
                  className={`font-display text-base sm:text-lg font-semibold transition-colors ${
                    dark
                      ? 'text-white group-hover:text-[#00CFFF]'
                      : 'text-[#101C35] group-hover:text-[#1769FF]'
                  }`}
                >
                  {item.question}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#1769FF]' : dark ? 'text-[#C8D0DA]' : 'text-slate-400'
                }`}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pl-9 pr-4 sm:pr-10">
                    <p
                      className={`text-sm sm:text-[15px] leading-relaxed ${
                        dark ? 'text-[#C8D0DA]' : 'text-slate-600'
                      }`}
                    >
                      {item.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
