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

interface ProductCarouselProps {
  products: IProduct[];
  itemsPerView?: number;
}

export function ProductCarousel({ 
  products, 
}: ProductCarouselProps) {
  if (products.length === 0) return null;

  return (
          <Carousel
            className="w-full"
            opts={{
              align: 'start',
              loop: true,
            }}
          >
            <CarouselContent >
              {products.map((product) => (
                <CarouselItem key={product.id} className="basis-1/2 lg:basis-1/4 xl:basis-1/5">
                  <div className="p-1">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full border-0 bg-white/95 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 z-10" />
            <CarouselNext className="absolute -right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full border-0 bg-white/95 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 z-10" />
          </Carousel>
    
  );
}