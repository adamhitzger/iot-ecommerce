"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"

export default function About(){
    return (
       <section className="w-full flex flex-wrap space-y-4">
        <div className="flex flex-row justify-center space-y-6 w-full md:w-1/2 ">
        <Image src={"/images/logo.png"} alt="Co je Hydroocann?" width={500} height={500}/>
        </div>
        <div className="flex flex-col justify-center text-right space-y-6 w-full md:w-1/2 ">
       <h1 className=" text-5xl font-bold">Kdo jsme?</h1>
       <p className="text-xl font-light">Na trhu se pohybujeme od roku 2020. Při prodeji nás nejvíce naplňovala a motivovala zpětná vazba od zákazníků. nabrali jsme nějaké zkušenosti a chceme lidem pomoct při výběru příslušentství např. k dabbování😶‍🌫️.</p>
       <Link href={`/kontakt`}>
        <Button>Kontaktujte nás</Button>
        </Link>
    </div>
       
       </section>
    )
   }