"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { whyCards } from "@/constant"
import { Card } from "@/types"
export default function About(){
    return (
        <>
       <section className="w-full flex flex-wrap space-y-4">
        <div className="flex flex-row justify-center space-y-6 w-full md:w-1/2 ">
        <Image src={"/images/logo.png"} alt="Co je Hydroocann?" width={500} height={500}/>
        </div>
        <div className="flex flex-col justify-center text-right space-y-6 w-full md:w-1/2 ">
       <h1 className=" text-6xl font-bold">Kdo jsme?</h1>
       <p className="text-2xl ">Na trhu se pohybujeme od roku 2020. Při prodeji nás nejvíce naplňovala a motivovala zpětná vazba od zákazníků. nabrali jsme nějaké zkušenosti a chceme lidem pomoct při výběru příslušentství např. k dabbování😶‍🌫️.</p>
       <Link href={`/kontakt`}>
        <Button>Kontaktujte nás</Button>
        </Link>
    </div>
       
       </section>
       <section className="w-full flex flex-col space-y-8">
       <h1 className=" text-6xl font-bold text-center">Proč Hydroocann?</h1>
       <div className="grid grid-cols-2 md:grid-cols-4 justify-items-center gap-6 w-full ">
       {whyCards.map((c: Card, i: number) => (
        <article key={i} className="max-w-56 space-y-1 flex flex-col items-center rounded-lg w-full  p-4 bg-primary-third">
            {c.icon}
            <h2 className=" text-2xl font-bold underline underline-offset-4">{c.heading}</h2>
            <p >{c.text}</p>
        </article>
       ))}
       
       </div>
      </section>
      </>
    )
   }