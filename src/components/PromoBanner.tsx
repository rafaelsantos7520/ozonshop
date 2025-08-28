'use client';

import { Truck, CreditCard, Gift, Percent } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface PromoItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface PromoBannerProps {
  infoBoxes: PromoItem[];
}

const iconMap = {
  truck: Truck,
  creditCard: CreditCard,
  gift: Gift,
  percent: Percent,
};

export function PromoBanner({ infoBoxes }: PromoBannerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Truck;
    return <IconComponent className="h-6 w-6 text-white" />;
  };

  if (isMobile) {
    return (
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-sm">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
            className="w-full">
            <CarouselContent>
              {infoBoxes.map((item) => (
                <CarouselItem key={item.title}>
                  <div className="flex items-center gap-3 justify-center px-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                      {typeof item.icon === 'string' ? getIconComponent(item.icon) : item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-tight">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    );
  }

  // Layout desktop
  return (
    <div className="flex justify-center mt-8">
      <div className="flex flex-row gap-4">
        {infoBoxes.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
              {typeof item.icon === 'string' ? getIconComponent(item.icon) : item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base leading-tight">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-tight">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}