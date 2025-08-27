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
    <section className={`py-8`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{title}</h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-7xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4 py-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex cursor-pointer" />
          <CarouselNext className="hidden md:flex cursor-pointer" />
        </Carousel>
      </div>
    </section>
  );
}