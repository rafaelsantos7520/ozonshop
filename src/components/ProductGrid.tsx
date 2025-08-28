import { ProductCard } from './ProductCard';
import { IProduct } from '@/types/product';



export function ProductGrid({ products }: { products: IProduct[] }) {

  if (!products || products.length === 0) {
    return (
      <div className="mt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p>Nenhum produto encontrado</p>
        </div>
      </div>
    );
  }


  return (
    <div className=" md:mt-16">
      <div className="mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products?.map((product: IProduct) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}