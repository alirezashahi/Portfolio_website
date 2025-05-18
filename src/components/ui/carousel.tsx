import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageType = {
  url: string;
  alt: string;
  caption?: string;
};

interface CarouselProps {
  images: ImageType[];
  autoSlideInterval?: number;
}

const Carousel = ({ images, autoSlideInterval = 5000 }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAutoSlidePaused, setIsAutoSlidePaused] = useState(false);

  // Required minimum distance between touch start and end to be detected as swipe
  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle automatic sliding
  useEffect(() => {
    if (!isAutoSlidePaused && images.length > 1) {
      const interval = setInterval(nextSlide, autoSlideInterval);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [nextSlide, autoSlideInterval, isAutoSlidePaused, images.length]);

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    // Reset touch positions
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      nextSlide();
    } else if (e.key === "ArrowLeft") {
      prevSlide();
    }
  };

  // Pause auto-slide on user interaction
  const pauseAutoSlide = () => setIsAutoSlidePaused(true);
  const resumeAutoSlide = () => setIsAutoSlidePaused(false);

  // If no images, don't render
  if (!images.length) return null;

  return (
    <div 
      className="relative w-full overflow-hidden rounded-lg bg-background"
      onMouseEnter={pauseAutoSlide}
      onMouseLeave={resumeAutoSlide}
      onTouchStart={pauseAutoSlide}
      onTouchEnd={resumeAutoSlide}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Image carousel"
    >
      {/* Image container */}
      <div 
        className="flex transition-transform duration-500 ease-out h-[400px] md:h-[500px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div 
            key={index} 
            className="w-full flex-shrink-0 relative"
            aria-hidden={index !== currentIndex}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 text-sm">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
            onClick={prevSlide}
            aria-label="Previous slide"
            tabIndex={0}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
            onClick={nextSlide}
            aria-label="Next slide"
            tabIndex={0}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex}
                tabIndex={0}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel; 