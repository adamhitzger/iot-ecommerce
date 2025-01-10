"use client"
import Link from "next/link"
import {SocialIcon} from "react-social-icons"
import 'react-social-icons/facebook'
import 'react-social-icons/instagram'

export default function Footer(){
    const year: number = new Date().getFullYear()
    return(
        <>
        <footer className="p-5 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-10 bg-secondary-foreground  sm:justify-items-center">
            <div className="flex text-lg flex-col">
                <h3 className="text-xl font-bold underline underline-offset-2">Máte nějaký dotaz ?</h3>
                <Link href={"mailto:info@hydroocann.com"}>info@hydroocann.com</Link>
                <Link href={"tel:+420 420 420 666 "}>+420 420 420 666 </Link>
                <div className="flex flex-row">
                    <SocialIcon url={"https://www.instagram.com/hydroocann_official/"} bgColor="transparent"/>
                    <SocialIcon url={"https://www.facebook.com/Hydroocann/"} bgColor="transparent"/>
                </div>
            </div>

            <div className="flex text-lg flex-col">
                <h3 className="text-xl font-bold underline underline-offset-2">Podmínky</h3>
                <Link href={"/obchodni-podminky"}>Obchodní podmínky</Link>
                <Link href={"/souhlas"}> Souhlas se zpracováním osobních údajů</Link>
                <Link href={"/zasady"}> Zásady zpracování osobních údajů</Link>
                
            </div>

            <div className="flex text-lg flex-col">
                <h3 className="text-xl font-bold underline underline-offset-2">Vše o nákupu</h3>
                <Link href={"/reklamace"}>Reklamace</Link>
                <Link href={"/doprava-platba"}> Doprava a platba</Link>
                <Link href={"/kontakt"}> Kontakt</Link>
                
            </div>
        </footer>
            <span className="text-xl text-center ">{year} <Link href={"/"} className="underline">Adam Hitzger</Link></span>
        </>
    )
}