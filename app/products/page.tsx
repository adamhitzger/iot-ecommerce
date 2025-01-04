import { Categories, Products as P } from "@/types"
import { sanityFetch } from "@/sanity/lib/client"
import { ALL_CATEGORIES, ALL_PRODUCTS, PRODUCTS_BY_CAT } from "@/sanity/lib/queries";
import ProductsGrid, { CategoriesGrid } from "@/components/productsgrid";

export default async function Products({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }){
    let products, name;
    const params = await searchParams
    const categories = await sanityFetch<Categories>({query: ALL_CATEGORIES});
    if (params?.name) {
        name = params.name
        products = await sanityFetch<P>({query: PRODUCTS_BY_CAT, params: {name}});
    } else {
        products = await sanityFetch<P>({query: ALL_PRODUCTS})
    }
    return(
        <div>
        <CategoriesGrid categories={categories}/>
        <ProductsGrid products={products}/>
        </div>
   ) 
}