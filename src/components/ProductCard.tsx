import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProductCardProps } from '@/types/components';
import { Heart } from 'lucide-react'

export function ProductCard({ product }: ProductCardProps) {
  const originalPrice = product.price ? Number(product.price) * 1.5 : 0;
  const discount = 32;

  return (
    <div className="group w-full max-w-sm mx-auto">
      <Link href={`/product/${product.slug}`} passHref>
      <Card className="p-0 rounded-md transition-all duration-300 border border-gray-100 overflow-hidden h-[280px] md:h-[480px] flex flex-col">
          <div className="relative h-40 md:h-64 bg-gray-50 overflow-hidden">
            {product.image && (
              <Image
                // src={product.image}
                src={'/images/sof1.webp'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
   
         </div>
        
        <div className="px-3 py-2 flex-1 flex flex-col">
           <div className="space-y-1 md:space-y-2 flex-1">
             <div className="flex items-center justify-start">
               {product.category && (
                 <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs px-2 py-1">
                   {product.category.name}
                 </Badge>
               )}
             </div>
            
             <h3 className="text-xs md:text-lg font-semibold text-gray-900 line-clamp-1 md:line-clamp-2 leading-tight h-4 md:h-auto">
               {product.name}
             </h3>
           </div>
           
           <div className="flex flex-col md:flex-row items-start md:items-end justify-between mt-auto mb-2 md:mb-4 space-y-2 md:space-y-0">
             <div className="flex flex-col">
               {product.price && (
                 <>
                   <span className="text-sm md:text-xl font-bold text-gray-900">
                     {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
                   </span>
                   <div className="flex items-center space-x-1">
                     <span className="text-[10px] md:text-xs text-gray-500 line-through">
                       {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(originalPrice)}
                     </span>
                     <span className="text-[10px] md:text-xs font-medium text-green-600">{discount}% OFF</span>
                   </div>
                 </>
               )}
             </div>
      
               <span className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-3 py-1 md:px-6 md:py-2 text-[10px] md:text-sm font-medium w-full md:w-auto text-center">
                 comprar
               </span>
           </div>
         </div>
      </Card>
      </Link>
    </div>
  );
}