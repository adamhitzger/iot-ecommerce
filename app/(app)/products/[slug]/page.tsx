import { sanityFetch } from '@/sanity/lib/client'
import { PRODUCT, PRODUCT_REVIEWS } from '@/sanity/lib/queries'
import { Product as P, Reviews } from '@/types'
import React from 'react'
import { Metadata } from 'next';
import ProductComponent from '@/components/product';
import Newsletter from '@/components/newsletter';
export async function generateMetadata(props:{params: Promise<{ slug: string}>}):Promise<Metadata> {
    const params = await props.params;
    const p: P = await sanityFetch<P>({ query: PRODUCT, params: params });

    return{
        icons: {
            icon: "/images/logo.png"
          },
          applicationName: "Hydroocann Natural s.r.o.",
          generator: "Next.ts",
          title: `Hydroocann Natural s.r.o. - ${p.name}`,
          description: p.overview,
          authors: [{name: "Adam Hitzger"}, {name: "Ivan Čmiko"}],
          keywords: [
             p.overview, 
            ...p.keywords
        ],
        creator: "Adam Hitzger",
                publisher: "Adam Hitzger",
                formatDetection: {
                    email: false,
                    address: false,
                    telephone: false,
                  },
        openGraph: {
          title: `HydrooCann Natural s.r.o. - ${p.name}`,
          description: p.overview,
          url: `https://www.hydroocann.com/products/${p.slug}`,
          siteName: "HydrooCann Natural s.r.o.",
          images: [
            {
                url: p.picture,
                width: 800,
                height: 600,
            },
        ],
          locale: "cs_CZ",
          type: "website",
        },
    }
}
export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const productPromise = await sanityFetch<P>({ query: PRODUCT, params: params });
    const reviewsPromise = await sanityFetch<Reviews>({ query: PRODUCT_REVIEWS, params: params, revalidate: 10 });
    const [product, reviews] = await Promise.all([
        productPromise,
        reviewsPromise
    ])
    console.log(reviews)
    return (
        <>
        <ProductComponent product={product} reviews={reviews}/>
        <Newsletter/>
        </>
    )
}