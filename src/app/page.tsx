import { BannerCarousel } from '@/components/BannerCarousel';
import { ProductCarousel } from '@/components/ProductCarousel';
import { PromoBanner } from '@/components/PromoBanner';


export default async function Home() {

  const apiData = await fetch(`${process.env.BACKEND_URL}/`, {
    next: { revalidate: 3600 }
  }) 
  const {data} = await apiData.json()

  const sliders = [
    {
      id: 1,
      title: 'Promoção Especial',
      description: 'Confira nossos produtos em promoção!',
      image: '/images/carrosel/baner1.webp',
      link: '/promocoes',
      button_text: 'Ver Mais',
      button_url: '/promocoes',
    },
    {
      id: 2,
      title: 'Promoção Especial',
      description: 'Confira nossos produtos em promoção!',
      image: '/images/carrosel/baner2.webp',  
      link: '/promocoes',
      button_text: 'Ver Mais',
      button_url: '/promocoes',
    },
    {
      id: 3,
      title: 'Promoção Especial',
      description: 'Confira nossos produtos em promoção!',
      image: '/images/carrosel/banner3.webp',
      link: '/promocoes',
      button_text: 'Ver Mais',
      button_url: '/promocoes',
    },
  ]

  return (
    <div className="container mx-auto" >
      {/* Banner Carrossel */}
      <section className="">
        <BannerCarousel slides={sliders} />
      </section>

      <PromoBanner  infoBoxes={data.info_boxes} />

        <section id="default-sections" className="py-16  px-2 gap-6  flex flex-col">

          {/* Carrossel de Perfumaria */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Perfumaria</h2>
            <ProductCarousel 
              products={data.latest_products} 
              itemsPerView={4}
            />
          </div>
          

          {/* Carrossel de Suplementos */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Suplementos Alimentares</h2>
            <ProductCarousel 
              products={data.top_rated_products} 
              itemsPerView={4}
            />
          </div>

          {/* Carrossel de Bem Estar */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Bem Estar</h2>
            <ProductCarousel 
              products={data.best_sellers} 
              itemsPerView={4}
            />
          </div>
          

          {/* Carrossel de Produtos Capilares */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Produtos Capilares</h2>
            <ProductCarousel 
              products={data.top_rated_products}
              itemsPerView={4}
            />
          </div>

          {/* Carrossel de Acessórios */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Acessórios</h2>
            <ProductCarousel 
              products={data.top_rated_products} 
              itemsPerView={4}
            />
          </div>
        </section>
    </div>
  );
}