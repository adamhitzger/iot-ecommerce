"use client"

import { Products, Product as P, Categories, Category as C } from "@/types"
import Image from "next/image";
import Link from "next/link";
import { useRouter,useSearchParams } from "next/navigation";
import { Suspense, useState, useRef } from "react";
import { formUrlQuery } from '@/lib/utils';
import { CardContainer, CardItem } from "./ui/3d-card";
import { useInView, motion } from "motion/react";

export default function ProductsGrid({products}:{products: Products}){
    const ref = useRef(null)
    const inView = useInView(ref)
   return (
    <motion.section 
    initial={{opacity: 0, x: -500}}
        animate={inView?{opacity: 1, x: 0}: {}}
        exit={{opacity: 0, x: -500}}
        transition={{duration: 0.5}}
        ref={ref}
    className="w-full flex flex-col items-center space-y-4 text-center">
    <h1 className=" font-bold">Nové produkty</h1>
    <p className="text-xl lg:text-2xl md:w-3/4  font-light">Naskladněné produkty připravené k pro Vás. Uplatněte slevový kupón a objednejte domů. Naskladněné produkty připravené k pro Vás. Uplatněte slevový kupón a objednejte domů.</p>
    <div className="w-full gap-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 justify-items-center">
        {products.length>0 ? products.map((p: P, i: number) => (
           <Product p={p} key={i}/>
        )) : <p className="text-center text-xl font-bold text-primary-foreground">Nebyly nalezeny žádné produkty</p>}
    </div>
    </motion.section>
 )
}

export function CategoriesGrid({categories}:{categories: Categories}){
    const ref = useRef(null)
    const inView = useInView(ref)
    return(
        <motion.section 
        initial={{opacity: 0, x: 500}}
        animate={inView?{opacity: 1, x: 0}: {}}
        exit={{opacity: 0, x: 500}}
        transition={{duration: 0.5}}
        ref={ref}
        className="w-full flex flex-col space-y-4 text-center">
        <h1 className=" font-bold text-center">Kategorie</h1>
    <div className="w-full justify-items-center grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((c: C, i: number) => (
            <Suspense key={i}>
                <Link href={`/products/?name=${c.slug}`}>
            <Category c={c} />
            </Link>
            </Suspense>
        ))}
    </div>
    </motion.section>
    )
}

export function Product({p}: {p: P}) {

    return(
        <Link href={`/products/${p.slug}`}  >
        <CardContainer  className="w-full max-w-56 flex flex-col items-center rounded-xl p-3 bg-secondary-foreground">
          
            <CardItem className="place-self-center max-w-[150px] max-h-[150px]"
            translateZ={50}
            >
                
                <Image src={p.picture} alt={p.name} width={150} height={150} className="max-w-[150px] max-h-[150px] w-full h-full object-contain"/>
            </CardItem>
            
            <CardItem translateZ={60} className="text-left w-full flex flex-col">
            <h2 className=" text-xl font-bold underline decoration-wavy decoration-secondary underline-offset-4">{p.name}</h2>
            <div className="flex flex-row text-xl md:text-2xl font-medium space-x-3">
                    <span className={`${p.sale ? "text-red-600 line-through font-bold" : null}`}>{p.price} Kč</span> {p.sale ? <span>{(1-(p.sale/100)) * p.price } Kč</span> : null}
            </div>
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
                <h2 className=" text-xl font-bold underline underline-offset-4 decoration-wavy decoration-secondary">{c.name}</h2>
            
                </CardItem>
            </CardContainer>
    )
}