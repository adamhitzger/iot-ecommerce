import Image from "next/image";
import { Products, Categories, Banners } from "@/types";
import { BANNERS, CATEGORIES, PRODUCTS } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/client";
import { Slider} from "@/components/banners";
import ProductsGrid  from "@/components/productsgrid";
import About from "@/components/about";
export default async function Home() {
  const productsPromise = await sanityFetch<Products>({query: PRODUCTS});
  const bannersPromise = await sanityFetch<Banners>({query: BANNERS});
  const categoriesPromise = await sanityFetch<Categories>({query: CATEGORIES});
  const [banners, products, categories] = await Promise.all([
    bannersPromise,
    productsPromise,
    categoriesPromise
  ])
  
  return (
    <div className="space-y-8">
      <Slider slides={banners}/> 
      <ProductsGrid products={products} categories={categories}/>
      <About/>
    </div>
  );
}
