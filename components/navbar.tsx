"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBagIcon, MenuIcon } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet" 
import { Href} from "@/types";
import { navLinks } from "@/constant";

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
            <Sheet>
            <SheetTrigger>
            <Image src={"/images/bong.svg"} alt="Bong logo hydroocannu" width={36} height={36}/>
                </SheetTrigger>
                <SheetContent side={"left"}>
                 <SheetHeader>
                <SheetTitle>Váš košík</SheetTitle>
                <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.🤨
                </SheetDescription>
                </SheetHeader>
         </SheetContent>
            </Sheet>

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