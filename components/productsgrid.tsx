"use client"

import { Products, Product as P, Categories, Category as C } from "@/types"
import Image from "next/image";
import Link from "next/link";
import { useRouter,useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { formUrlQuery } from '@/lib/utils';
import { CardContainer, CardItem } from "./ui/3d-card";


export default function ProductsGrid({products}:{products: Products}){
 return (
    <section className="w-full flex flex-col items-center space-y-4 text-center">
    <h1 className=" text-6xl font-bold">Nové produkty</h1>
    <p className="text-xl lg:text-2xl md:w-3/4  font-light">Naskladněné produkty připravené k pro Vás. Uplatněte slevový kupón a objednejte domů. Naskladněné produkty připravené k pro Vás. Uplatněte slevový kupón a objednejte domů.</p>
    <div className="w-full gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 justify-items-center">
        {products.map((p: P, i: number) => (
           <Product p={p} key={i}/>
        ))}
    </div>
    </section>
 )
}

export function CategoriesGrid({categories}:{categories: Categories}){
    return(
        <section className="w-full flex flex-col space-y-4 text-center">
        <h1 className=" text-6xl font-bold text-center">Kategorie</h1>
    <div className="w-full justify-items-center grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((c: C, i: number) => (
            <Suspense key={i}>
            <Category c={c} />
            </Suspense>
        ))}
    </div>
    </section>
    )
}

export function Product({p}: {p: P}) {

    return(
        <Link href={`/products/${p.slug}`}  >
        <CardContainer  className="w-full max-w-56 flex flex-col items-center rounded-xl p-3 bg-secondary-foreground">
          
            <CardItem className="place-self-center"
            translateZ={50}
            >
                
                <Image src={p.picture} alt={p.name} width={150} height={150}/>
            </CardItem>
            
            <CardItem translateZ={60} className="text-left w-full flex flex-col">
            <h2 className=" text-xl font-bold underline decoration-wavy underline-offset-4">{p.name}</h2>
            <p>{p.overview}</p>
            </CardItem>
        </CardContainer>
        </Link>
    )
}

export function Category({c}: {c: C}) {
    const [active, setActive] = useState<string>("");
    const searchParams = useSearchParams();
    const router = useRouter();
    const handleTypeClick = (item: string) => {
        if (active === item) {
            setActive("");

            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'name',
                value: null
            })

            router.push(newUrl, { scroll: false });
        } else {
            setActive(item);

            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'name',
                value: item.toLowerCase()
            })

            router.push(newUrl, { scroll: false });
        }
    }
    return(
            <CardContainer    onClickCapture={() => handleTypeClick(String(c.slug))}  className="text-center flex flex-col items-center rounded-full p-5 w-40 bg-secondary-foreground">
                <CardItem translateZ={30} >
                <Image src={c.picture} alt={c.name} width={100} height={100}/>
                <h2 className=" text-xl font-bold underline underline-offset-4">{c.name}</h2>
                </CardItem>
            </CardContainer>
    )
}