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
    <div className="min-h-screen pb-8" >
      {/* Banner Carrossel */}
      <section className="">
        <BannerCarousel slides={sliders} />
      </section>

      <PromoBanner  infoBoxes={data.info_boxes} />

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