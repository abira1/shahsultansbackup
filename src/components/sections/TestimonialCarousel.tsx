import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
const testimonials = [{
  id: 1,
  name: 'Sarah Johnson',
  band: '7.5',
  image: 'https://i.postimg.cc/K8xkJpv3/536268281-122208266720126286-7708938899969929883-n.jpg',
  text: "Shah Sultan's IELTS Academy helped me achieve my dream score of 7.5. The instructors provided personalized feedback that significantly improved my writing and speaking skills.",
  destination: 'University of Toronto',
  course: 'Academic IELTS',
  improvement: '+1.5 bands',
  duration: '3 months'
}, {
  id: 2,
  name: 'Mohammed Ali',
  band: '7.0',
  image: 'https://i.postimg.cc/y8jJ5hkQ/536269114-122208451460126286-8178065957127452715-n.jpg',
  text: 'I had attempted IELTS twice before joining this academy. The structured approach and mock tests helped me identify my weaknesses and improve my band score from 5.5 to 7.0.',
  destination: 'University of Melbourne',
  course: 'Fast Track Course',
  improvement: '+1.5 bands',
  duration: '6 weeks'
}, {
  id: 3,
  name: 'Priya Sharma',
  band: '6.5',
  image: 'https://i.postimg.cc/9ff4j49W/537465075-122208847910126286-7760748678286341356-n.jpg',
  text: "As a beginner in English, I was nervous about taking the IELTS. The supportive environment at Shah Sultan's Academy helped me build confidence in spoken English, and I achieved a band score of 6.5!",
  destination: 'Coventry University',
  course: 'Academic IELTS',
  improvement: '+2.0 bands',
  duration: '4 months'
}, {
  id: 4,
  name: 'David Chen',
  band: '7.0',
  image: 'https://i.postimg.cc/mr6PZb37/538260651-122208847982126286-601535625864210434-n.jpg',
  text: 'The speaking practice sessions were invaluable. My teacher identified specific areas for improvement and provided practical strategies that boosted my confidence.',
  destination: 'University of Sydney',
  course: 'General Training',
  improvement: '+1.0 bands',
  duration: '2 months'
}];
const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const nextTestimonial = () => {
    if (animating) return;
    setDirection('right');
    setAnimating(true);
    setCurrentIndex(prevIndex => (prevIndex + 1) % testimonials.length);
    setTimeout(() => setAnimating(false), 500);
  };
  const prevTestimonial = () => {
    if (animating) return;
    setDirection('left');
    setAnimating(true);
    setCurrentIndex(prevIndex => (prevIndex - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setAnimating(false), 500);
  };
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };
  // Setup autoplay
  useEffect(() => {
    if (isAutoplay) {
      autoplayRef.current = setInterval(() => {
        nextTestimonial();
      }, 6000);
    }
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isAutoplay]);
  // Pause autoplay on hover
  const handleMouseEnter = () => {
    setIsAutoplay(false);
  };
  const handleMouseLeave = () => {
    setIsAutoplay(true);
  };
  const goToSlide = (index: number) => {
    if (animating) return;
    setDirection(index > currentIndex ? 'right' : 'left');
    setAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setAnimating(false), 500);
  };
  return <div className="relative mx-auto px-4 max-w-6xl" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} ref={carouselRef}>
      <div className="relative overflow-hidden" style={{
      minHeight: '320px',
      '@media (min-width: 640px)': {
        minHeight: '400px'
      }
    }}>
        {testimonials.map((testimonial, index) => <div key={testimonial.id} className={`absolute w-full transition-all duration-500 ease-in-out ${index === currentIndex ? 'opacity-100 translate-x-0 z-10' : index < currentIndex || currentIndex === 0 && index === testimonials.length - 1 ? `opacity-0 -translate-x-full ${direction === 'right' ? 'z-0' : 'z-20'}` : `opacity-0 translate-x-full ${direction === 'left' ? 'z-0' : 'z-20'}`}`} aria-hidden={index !== currentIndex}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-[1.01] mx-auto max-w-3xl">
              <div className="flex flex-col md:flex-row">
                {/* Image section */}
                <div className="md:w-2/5 relative">
                  <div className="h-48 sm:h-64 md:h-full w-full">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold shadow-md text-xs sm:text-sm">
                      IELTS {testimonial.band}
                    </span>
                  </div>
                </div>
                {/* Content section */}
                <div className="md:w-3/5 p-4 sm:p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <blockquote className="text-sm sm:text-base md:text-lg italic mb-4 sm:mb-6">
                      "{testimonial.text}"
                    </blockquote>
                    <div className="flex items-center">
                      <div className="h-px bg-gray-200 flex-grow"></div>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <h4 className="font-bold text-base sm:text-lg md:text-xl text-primary">
                      {testimonial.name}
                    </h4>
                    <p className="text-accent text-xs sm:text-sm">
                      {testimonial.destination}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                        {testimonial.course}
                      </span>
                      <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                        {testimonial.improvement}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>)}
      </div>
      {/* Navigation dots */}
      <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
        {testimonials.map((_, index) => <button key={index} className={`transition-all duration-300 ${index === currentIndex ? 'w-6 sm:w-8 bg-accent rounded-full' : 'w-2 sm:w-3 bg-gray-300 rounded-full hover:bg-gray-400'} h-2 sm:h-3`} onClick={() => goToSlide(index)} onKeyDown={e => handleKeyDown(e, () => goToSlide(index))} aria-label={`Go to testimonial ${index + 1}`} aria-current={index === currentIndex ? 'true' : 'false'}></button>)}
      </div>
      {/* Navigation arrows */}
      <button className="absolute top-1/2 -left-2 sm:-left-4 -translate-y-1/2 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-transform hover:scale-110 z-20" onClick={prevTestimonial} onKeyDown={e => handleKeyDown(e, prevTestimonial)} aria-label="Previous testimonial">
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
      </button>
      <button className="absolute top-1/2 -right-2 sm:-right-4 -translate-y-1/2 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-transform hover:scale-110 z-20" onClick={nextTestimonial} onKeyDown={e => handleKeyDown(e, nextTestimonial)} aria-label="Next testimonial">
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
      </button>
    </div>;
};
export default TestimonialCarousel;