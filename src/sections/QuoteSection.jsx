import React from 'react';
import { ArrowDown } from 'lucide-react';
import AnimatedQuote from '../components/AnimatedQuote';
import StackedSection from '../components/StackedSection';

// Optional framing: hairline stems above/below the quote and a scroll hint, as in the vision slide.
const QuoteSection = ({ id, index, zIndex, text, author, framed = false, tone }) => (
  <StackedSection id={id} index={index} zIndex={zIndex} theme="light" tone={tone} rule={!framed}>
    {framed && (
      <>
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-[100px] h-px bg-black/15" />
        <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[calc(100px+1.5vh)] h-[10vh] w-px bg-black/30" />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-[14vh] left-1/2 h-[10vh] w-px bg-black/30" />
        <div className="pointer-events-none absolute bottom-[5vh] left-6 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-600 md:flex">
          <span className="h-px w-9 bg-zinc-500" />
          <span>Scroll</span>
          <ArrowDown size={12} />
        </div>
      </>
    )}
    <AnimatedQuote text={text} theme="light" author={author} />
  </StackedSection>
);

export default QuoteSection;
