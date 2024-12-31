"use client"

import { Products, Product, Categories, Category } from "@/types"
import Image from "next/image";
import Link from "next/link";

export default function ProductsGrid({products, categories}:{products: Products, categories: Categories}){
 return (
    <section className="w-full flex flex-col space-y-4 text-center">
    <h1 className=" text-5xl font-bold">Nové produkty</h1>
    <p className="text-xl font-light">Naskladněné produkty připravené k pro Vás. Uplatněte slevový kupón a objednejte domů. Naskladněné produkty připravené k pro Vás. Uplatněte slevový kupón a objednejte domů.</p>
    <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {products.map((p: Product, i: number) => (
           <Product p={p} key={i}/>
        ))}
    </div>
    <h1 className=" text-5xl font-bold">Kategorie</h1>
    <div className="w-full  justify-items-center grid grid-cols-5 gap-6">
        {categories.map((c: Category, i: number) => (
            <Category c={c} key={i} />
        ))}
    </div>
    </section>
 )
}

export function Product({p}: {p: Product}) {
    return(
        <Link href={`/products/${p.slug}`}>
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

export function Category({c}: {c: Category}) {
    return(
        <Link  href={`/products?name=${c.slug}`}>
            <article  className=" flex flex-col items-center rounded-full p-5 w-40 bg-secondary-foreground">
                <div>
                <Image src={c.picture} alt={c.name} width={100} height={100}/>
                <h2 className=" text-xl font-bold underline underline-offset-4">{c.name}</h2>
                </div>
            </article>
            </Link>
    )
}