import { ProductGrid } from '@/components/ProductGrid';
import { BannerCarousel } from '@/components/BannerCarousel';
import { ProductCarousel } from '@/components/ProductCarousel';
import { PromoBanner } from '@/components/PromoBanner';
import { Button } from '@/components/ui/button';

export default async function Home() {

  const apiData = await fetch('http://34.207.78.115')
  const {data} = await apiData.json()
  const slides = data.slides
  const latest_products = data.latest_products
  const top_rated_products = data.top_rated_products
  const best_sellers = data.best_sellers
  const infoBoxes = data.info_boxes


  return (
    <div className="min-h-screen pb-8 px-4" >
      {/* Banner Carrossel */}
      <section className="">
        <BannerCarousel slides={slides} />
      </section>

      <PromoBanner  infoBoxes={infoBoxes} />

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
              products={latest_products} 
              title="Perfumaria" 
              itemsPerView={4}
              backgroundColor="white"
            />
          

          {/* Carrossel de Suplementos */}
            <ProductCarousel 
              products={top_rated_products} 
              title="Suplementos Alimentares" 
              itemsPerView={4}
              backgroundColor="gray"
            />

          {/* Carrossel de Bem Estar */}
            <ProductCarousel 
              products={best_sellers} 
              title="Bem Estar Ozonizada" 
              itemsPerView={4}
              backgroundColor="white"
            />
          

          {/* Carrossel de Produtos Capilares */}
            <ProductCarousel 
              products={top_rated_products} 
              title="Capilar Ozonizada" 
              itemsPerView={4}
              backgroundColor="gray"
            />

          {/* Carrossel de Acessórios */}
            <ProductCarousel 
              products={top_rated_products} 
              title="Acessórios" 
              itemsPerView={4}
              backgroundColor="white"
            />

        </section>
    </div>
  );
}