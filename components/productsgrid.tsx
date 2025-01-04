"use client"

import { Products, Product as P, Categories, Category as C } from "@/types"
import Image from "next/image";
import Link from "next/link";
import { useRouter,useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { formUrlQuery } from '@/lib/utils';

export default function ProductsGrid({products}:{products: Products}){
 return (
    <section className="w-full flex flex-col space-y-4 text-center">
    <h1 className=" text-6xl font-bold">Nové produkty</h1>
    <p className="text-xl">Naskladněné produkty připravené k pro Vás. Uplatněte slevový kupón a objednejte domů. Naskladněné produkty připravené k pro Vás. Uplatněte slevový kupón a objednejte domů.</p>
    <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
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
    <div className="w-full  justify-items-center grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
        <Link href={`/products/${p.slug}`} className="max-w-56">
        <article  className=" flex flex-col items-center rounded-lg w-full  p-2 bg-secondary-foreground">
            <Image src={p.picture} alt={p.name} width={150} height={150}/>
            <div className="text-left w-full flex flex-col">
            <h2 className=" text-xl font-bold underline underline-offset-4">{p.name}</h2>
            <p>{p.overview}</p>
            </div>
        </article>
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
            <article onClickCapture={() => handleTypeClick(String(c.slug))}  className="text-center flex flex-col items-center rounded-full p-5 w-40 bg-secondary-foreground">
                <div>
                <Image src={c.picture} alt={c.name} width={100} height={100}/>
                <h2 className=" text-xl font-bold underline underline-offset-4">{c.name}</h2>
                </div>
            </article>
    )
}