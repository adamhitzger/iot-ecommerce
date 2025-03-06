"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { whyCards } from "@/constant"
import { InfiniteMovingCards } from "./ui/infinite-moving-cards"
import { useInView, motion } from "motion/react"
import { useRef } from "react"

export default function About(){
    const ref = useRef(null)
    const inView = useInView(ref)
    const ref2 = useRef(null)
    const inView2 = useInView(ref2)
    return (
        <>
       <motion.section 
       initial={{opacity: 0, x: 500}}
       animate={inView?{opacity: 1, x: 0}: {}}
       exit={{opacity: 0, x: 500}}
       transition={{duration: 0.5}}
       ref={ref}
       className="w-full flex flex-wrap space-y-4">
        <div className="flex flex-row justify-center space-y-6 w-full md:w-1/2 ">
        <Image src={"/images/logo.png"} alt="Co je Hydroocann?" width={500} height={500}/>
        </div>
        <div className="flex flex-col justify-center text-right space-y-6 w-full md:w-1/2 ">
       <h1 className="  font-bold">Kdo jsme?</h1>
       <p className="text-lgmd:text-2xl ">Na trhu se pohybujeme od roku 2020. Při prodeji nás nejvíce naplňovala a motivovala zpětná vazba od zákazníků. nabrali jsme nějaké zkušenosti a chceme lidem pomoct při výběru příslušentství např. k dabbování😶‍🌫️.</p>
       <Link href={`/kontakt`}>
        <Button size={"default"}>Kontaktujte nás</Button>
        </Link>
    </div>
       
       </motion.section>
       <motion.section
       initial={{opacity: 0, x: -500}}
       animate={inView2?{opacity: 1, x: 0}: {}}
       exit={{opacity: 0, x: -500}}
       transition={{duration: 0.5}}
       ref={ref2}
       className="w-full flex flex-col space-y-8">
       <h1 className="  font-bold text-center">Proč Hydroocann?</h1>
       <div className="flex items-center w-full relative overflow-hidden">
       <InfiniteMovingCards items={whyCards} direction="right"
        speed="fast"/>
       
       </div>
      </motion.section>
      </>
    )
   }