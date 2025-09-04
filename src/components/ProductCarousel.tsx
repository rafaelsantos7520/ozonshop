'use client';

import { IProduct } from '@/types/product';
import { ProductCard } from '@/components/ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface ProductCarouselProps {
  products: IProduct[];
  title: string;
  itemsPerView?: number;
  backgroundColor?: 'white' | 'gray';
}

export function ProductCarousel({ 
  products, 
  title, 
  backgroundColor = 'white'
}: ProductCarouselProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-4">
      <div className="max-w-5xl mx-auto px-3">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 text-center">{title}</h2>
        
        <div className="relative">
          <Carousel
            opts={{
              loop: true,
              align: 'start',
              slidesToScroll: 1
            }}
            plugins={[Autoplay({ delay: 7000, stopOnInteraction: false })]}
            className="w-full"
          >
            <CarouselContent className="-ml-1">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-1 basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full border-0 bg-white/95 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 z-10" />
            <CarouselNext className="absolute -right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full border-0 bg-white/95 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 z-10" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}