import { BannerCarousel } from '@/components/BannerCarousel';
import { ProductCarousel } from '@/components/ProductCarousel';
import { PromoBanner } from '@/components/PromoBanner';
import { apiFetch } from '@/lib/apiFetch';
import { getAllCategories } from '@/services/category/categoryService';
import Link from 'next/link';

export default async function Home() {

  const apiData = await apiFetch.get<any>('/', 3600) 
  const data = apiData.data
  const categories = await getAllCategories(3600);


  return (
    <div className="min-h-screen pb-8 px-4" >
      {/* Banner Carrossel */}
      <section className="">
        <BannerCarousel slides={data.slides} />
      </section>

      <PromoBanner  infoBoxes={data.info_boxes} />


      <div className="my-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Categorias
        </h2>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category:any) => (
            <Link
              key={category.id}
              href={`/product/category/${category.slug}`}
              className="rounded-lg px-4 py-2  border text-white bg-teal-500"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

        <section id="default-sections" className="py-16  px-0">

          {/* Carrossel de Perfumaria */}
            <ProductCarousel 
              products={data.latest_products} 
              title="Perfumaria" 
              itemsPerView={4}
              backgroundColor="white"
            />
          

          {/* Carrossel de Suplementos */}
            <ProductCarousel 
              products={data.top_rated_products} 
              title="Suplementos Alimentares" 
              itemsPerView={4}
              backgroundColor="gray"
            />

          {/* Carrossel de Bem Estar */}
            <ProductCarousel 
              products={data.best_sellers} 
              title="Bem Estar Ozonizada" 
              itemsPerView={4}
              backgroundColor="white"
            />
          

          {/* Carrossel de Produtos Capilares */}
            <ProductCarousel 
              products={data.top_rated_products}
              title="Capilar Ozonizada" 
              itemsPerView={4}
              backgroundColor="gray"
            />

          {/* Carrossel de Acessórios */}
            <ProductCarousel 
              products={data.top_rated_products} 
              title="Acessórios" 
              itemsPerView={4}
              backgroundColor="white"
            />

        </section>
    </div>
  );
}