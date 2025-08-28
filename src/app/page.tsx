import { ProductGrid } from '@/components/ProductGrid';
import { BannerCarousel } from '@/components/BannerCarousel';
import { ProductCarousel } from '@/components/ProductCarousel';
import { PromoBanner } from '@/components/PromoBanner';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { getAllCategories } from '@/services/category/categoryService';

export default async function Home() {

  const apiData = await api.get('/')
  const {data} = apiData.data
  const categories = await getAllCategories();


  return (
    <div className="min-h-screen pb-8 px-4" >
      {/* Banner Carrossel */}
      <section className="">
        <BannerCarousel slides={data.slides} />
      </section>

      <PromoBanner  infoBoxes={data.info_boxes} />


      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Categorias
        </h2>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              className="rounded-full"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Search and Filter Section
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
        </div>
      </section> */}

      {/* Display Filtered Products or Default Sections */}
        {/* <section id="filtered-products" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Resultados da Busca
            </h2>
              <ProductGrid products={filteredProducts} />
            ) : (
              <p className="text-center text-gray-600 text-lg">Nenhum produto encontrado.</p>
          </div>
        </section>
      ) : ( */
      }
        <section id="default-sections" className="py-16 bg-white">


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