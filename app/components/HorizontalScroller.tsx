import { useRef } from "react";
import type { Media } from "~/lib/tmdb";
import { MediaCard } from "./MediaCard";

interface HorizontalScrollerProps {
  title: string;
  items: Media[];
}

export function HorizontalScroller({ title, items }: HorizontalScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="mb-12">
      {/* Title */}
      <div className="px-4 md:px-6 lg:px-8 mb-4">
        <h2 className="text-2xl font-semibold text-[#111111] dark:text-white">
          {title}
        </h2>
      </div>

      {/* Scroller Container */}
      <div className="relative group/scroller px-4 md:px-6 lg:px-8">
        {/* Left Button */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/90 dark:bg-[#14171F]/90 backdrop-blur rounded-full shadow-lg opacity-0 group-hover/scroller:opacity-100 transition-opacity hover:scale-110"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6l6 6" />
          </svg>
        </button>

        {/* Scrollable Area */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8"
          style={{ 
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex gap-4" style={{ willChange: 'transform' }}>
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[160px] md:w-[200px]"
              >
                <MediaCard media={item} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Button */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white/90 dark:bg-[#14171F]/90 backdrop-blur rounded-full shadow-lg opacity-0 group-hover/scroller:opacity-100 transition-opacity hover:scale-110"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6l-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
