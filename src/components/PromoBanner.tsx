'use client';

import { Truck, CreditCard, Gift, Percent } from 'lucide-react';

interface PromoItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface PromoBannerProps {
  infoBoxes: PromoItem[];
}

export function PromoBanner({ infoBoxes }: PromoBannerProps) {
  return (
    <div className="flex justify-center mt-8">
        <div className="flex flex-col lg:flex-row gap-4" >
          {infoBoxes.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm md:text-base leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-tight">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}