import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackageCarouselProps {
  children: React.ReactNode[];
}

const PackageCarousel = ({ children }: PackageCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    loop: false,
    skipSnaps: false,
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-3">
          {children.map((child, index) => (
            <div 
              key={index} 
              className={cn(
                "flex-[0_0_85%] min-w-0 pl-3 transition-all duration-300",
                index === selectedIndex ? "scale-100 opacity-100" : "scale-95 opacity-70"
              )}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className={cn(
          "absolute left-1 top-1/2 -translate-y-1/2 z-10",
          "w-8 h-8 rounded-full bg-background/90 border border-border/50 shadow-lg",
          "flex items-center justify-center",
          "transition-all duration-200",
          canScrollPrev 
            ? "opacity-100 hover:bg-primary hover:text-primary-foreground hover:scale-110" 
            : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className={cn(
          "absolute right-1 top-1/2 -translate-y-1/2 z-10",
          "w-8 h-8 rounded-full bg-background/90 border border-border/50 shadow-lg",
          "flex items-center justify-center",
          "transition-all duration-200",
          canScrollNext 
            ? "opacity-100 hover:bg-primary hover:text-primary-foreground hover:scale-110" 
            : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === selectedIndex 
                ? "w-6 bg-primary" 
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        ))}
      </div>

      {/* Swipe Hint */}
      <p className="text-center text-xs text-muted-foreground mt-3">
        Swipe to explore packages
      </p>
    </div>
  );
};

export default PackageCarousel;
