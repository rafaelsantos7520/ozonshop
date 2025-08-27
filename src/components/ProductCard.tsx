import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ProductCardProps } from '@/types/components';

export function ProductCard({ product }: ProductCardProps) {


  return (
    <div className="group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-cyan-200 h-[400px] sm:h-[580px] flex flex-col">
        {/* Imagem do Produto */}
        <div className="relative h-40 sm:h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {/* {discount > 0 && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-red-500 text-white">
                {discount}% OFF
              </Badge>
            </div>
          )} */}
          {product.is_featured && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-yellow-500 text-white">
                Destaque
              </Badge>
            </div>
          )}
        </div>
        
        {/* Informações do Produto */}
        <div className="p-2 sm:p-6 flex flex-col flex-grow">
          {product.category && (
            <div className="mb-2 flex justify-center h-6">
              <Badge className="bg-cyan-100 text-cyan-800 text-xs">
                {product.category.name}
              </Badge>
            </div>
          )}
          
          {/* Título com altura fixa */}
          <div className="h-8 sm:h-12 mb-1 sm:mb-2">
            <h3 className="text-sm sm:text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>
          
          {/* Descrição com altura fixa */}
          <div className="h-8 sm:h-10 mb-4 sm:mb-4">
            {product.description && (
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
          
          {/* Área flexível para empurrar preço e botão para baixo */}
          <div className="flex-grow"></div>
          
          {/* Preço */}
          <div className="mb-2 sm:mb-4">
            <div className="flex items-center gap-2">
              {product.price && (
                <span className="text-md sm:text-2xl font-bold text-cyan-600">
                  {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
                </span>
              )}
            </div>
          </div>
          
          {/* Botão sempre na parte inferior */}
          <div>
            <Link href={`/product/${product.slug}`} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 sm:py-3 px-4 rounded-full transition-colors duration-300 text-sm sm:text-base">
              Ver Produto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}