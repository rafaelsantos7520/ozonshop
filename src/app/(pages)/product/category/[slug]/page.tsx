import { ProductGrid } from "@/components/ProductGrid";
import { getProductsByCategory } from "@/services/product/productService";


type Params  = Promise<{
  slug: string
}>

export const generateMetadata = async ({params}:{params:Params}) => {
  const paramsSlug = await params;
  return {
    title: paramsSlug.slug
  }
}
export default async function Page(props: {params: Params}) {
  const params = await props.params;
  const data = await getProductsByCategory(params.slug);
  return (
    <div className="container mx-auto px-4 py-2 md:py-8">
      <h1 className="text-3xl font-bold text-center my-8">{params.slug}</h1>
      <ProductGrid products={data.products} />
    </div>
  )
}

