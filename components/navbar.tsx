"use client";
import Image from "next/image";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet" 
import { Href} from "@/types";
import { navLinks } from "@/constant";
import Basket from "./basket";

export default function Navbar() {
    
    return(
        <nav className="flex flex-row items-center w-full justify-between">
            <Link href={"/"}>
                <Image src={"/images/logo.png"} alt="Hydroocann logo" className="mr-4" width={200} height={200}/>
                </Link>
            <div className="hidden md:flex md:flex-row space-x-6 lg:space-x-20">
            {navLinks.map((n: Href, i: number) => (
                <Link key={i} href={n.route} className="tracking-wider font-semibold text-xl lg:text-2xl">
                    {n.name}
                </Link>
            ))}
            </div>
            <div className="flex flex-row items-center space-x-4 ml-4">
            <Basket/>

            <div className="md:hidden">
            <Sheet>
            <SheetTrigger>
            <MenuIcon className="h-10 w-10" strokeWidth={2.3}/>
                </SheetTrigger>
                <SheetContent className="flex flex-col">
                {navLinks.map((n: Href, i: number) => (
                <Link key={i} href={n.route} className="tracking-wider font-semibold text-2xl">
                    {n.name}
                </Link>
            ))}
         </SheetContent>
            </Sheet>
            </div>
            </div>
        </nav>
    )
}