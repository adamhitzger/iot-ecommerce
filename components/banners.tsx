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

export function Slider({slides}: {slides: Banners}) {
    const plugin = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );
    return( 
        <Carousel
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            className="w-full"
        >
            <CarouselContent>
                {slides.map((s: Banner, i: number) => (
                    <CarouselItem className="flex flex-wrap w-full gap-y-" key={i}>
                        <div className="flex flex-col justify-center space-y-6 w-full md:w-1/2 px-8">
                            <h1 className="font-bold text-5xl">{s.heading}</h1>
                            <p className="font-medium text-3xl">{s.text}</p>
                            <Link href={`/categories?name=${s.category.slug}`}>
                                <Button>Zakoupit</Button>
                            </Link>
                        </div>
                        <div className="flex flex-row w-full md:w-1/2 justify-end">
                            <Image  src={s.imageUrl} alt={s.text} width={400} height={400}/>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-4 z-10 text-white hover:text-primary transition-colors" />
            <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-4 z-10 text-white hover:text-primary transition-colors" />
        </Carousel>
    )
}