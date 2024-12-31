import { sanityFetch } from "@/sanity/lib/client";
import { PRODUCTS } from "@/sanity/lib/queries";
import { MetadataRoute } from "next";
import { Products, Product, XML } from "@/types";


export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl: string = "https://hydroocann.com";
    const staticPages: XML = [
        "/",
        "/products",
        "/checkout",
        "/obchodni-podminky",
        "/kontakt",
        "/souhlas",
        "/zasady",
        "/reklamace",
        "/doprava-platba",
        "/velkoobchod"
      ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString()
      }));
    const productPromise: XML = await sanityFetch<Products>({query: PRODUCTS}).then((products) =>
        products.map((p: Product) => ({
            url: `${baseUrl}/products/${p.slug}`,
            lastModified: new Date().toISOString()
        }))
    );
    
    let fetchedRoutes: XML = [];
    try{
        fetchedRoutes = (await Promise.all([productPromise])).flat();

    }catch(error){
        throw JSON.stringify(error)
    } 
    return [...staticPages, ...fetchedRoutes];
}