"use client"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Banners, Banner } from "@/types"
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import Link from "next/link"; 
import Image from "next/image";
import { Button } from "./ui/button";
import { motion } from "motion/react";

export function Slider({slides}: {slides: Banners}) {

    const plugin = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );
    return( 
        <Carousel
        opts={{
            loop: true
        }}
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            className="w-full"
            role="header"
        >
            <CarouselContent>
                {slides.map((s: Banner, i: number) => (
                    <CarouselItem className="flex flex-wrap-reverse w-full gap-y-6 sm:gap-y-0" key={i}>
                        <motion.div 
                        initial={{opacity: 0, y: -500}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -500}}
                        transition={{duration: 0.5}}
                        className="flex flex-col justify-center space-y-6 w-full md:w-1/2 px-8">
                            <h1 className="font-bold text-left text-5xl sm:text-7xl">{s.heading}</h1>
                            <p className="font-medium text-4xl">{s.text}</p>
                           
                            <Link href={`/products?name=${s.category ? s.category.slug : s.product.slug}`}>
                                <Button>Zobrazit 👀</Button>
                            </Link>
                        </motion.div>
                    
                        <div className="relative flex flex-row min-h-72 sm:min-h-80 md:min-h-96 w-full md:w-1/2 justify-end">
                            <Image  src={s.imageUrl} alt={s.text} fill className="object-contain"/>
                        </div>
                        
                    </CarouselItem>
               
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-4 z-10 text-white hover:text-primary transition-colors" />
            <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-4 z-10 text-white hover:text-primary transition-colors" />
        </Carousel>
    )
}