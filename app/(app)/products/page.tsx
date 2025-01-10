import { Categories, Products as P } from "@/types"
import { sanityFetch } from "@/sanity/lib/client"
import { ALL_CATEGORIES, ALL_PRODUCTS, PRODUCTS_BY_CAT } from "@/sanity/lib/queries";
import ProductsGrid, { CategoriesGrid } from "@/components/productsgrid";
//import { Pagination } from "@/components/ui/pagination";
import PaginationComp from "@/components/paginationComp";

export default async function Products({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }){
    let products, name;
    const PAGE_SIZE = 16;
    const params = await searchParams
    const currentPage = parseInt(params.page || '1');
    const size = currentPage > 1 ? PAGE_SIZE + 1 : PAGE_SIZE;
    const start = (currentPage - 1) * size;
    const end = start + PAGE_SIZE

    const categories = await sanityFetch<Categories>({query: ALL_CATEGORIES});
    if (params?.name) {
        name = params.name
        products = await sanityFetch<P>({query: PRODUCTS_BY_CAT, params: {name, start, end}});
    } else {
        products = await sanityFetch<P>({query: ALL_PRODUCTS, params: {start, end}})
    }

    const totalPages = Number(products.length) / PAGE_SIZE;
    return(
        <div>
            <CategoriesGrid categories={categories}/>
            <ProductsGrid products={products}/>
            <PaginationComp currentPage={currentPage} totalPages={totalPages}/>
        </div>
   ) 
}