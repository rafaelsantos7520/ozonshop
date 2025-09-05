'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';


export interface Slide {

  button_text: string;
button_url : string
highlight?: string
image: string
price?: string
price_fraction?: string
price_label?: string
subtitle?: string
title?: string
}

interface BannerCarouselProps {
  slides: Slide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}



export function BannerCarousel({ 
  slides, 
  autoPlay = true, 
  autoPlayInterval = 8000 
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval]);

  if (slides.length === 0) return null;

  return (
    <div className="max-w-full mx-auto relative  h-[200px] lg:h-[600px] overflow-hidden  shadow-lg">
    
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full  flex-shrink-0 relative">
            <Image
              src={slide.image}
              alt={`Banner ${index + 1}`}
              fill
              className=""
              priority={index === 0}
            />
          </div>
        ))}
      </div>



      {/* Indicadores */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}