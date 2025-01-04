"use client"

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PaymentSucess() {
    return (
        <div className="w-full flex flex-1 justify-center items-center p-8">
            <div className="w-[350px] bg-primary-third rounded-lg">
                <div className="p-6">
                    <div className="w-full flex justify-center">
                        <Check className="size-12 p-2 rounded-full bg-green-500/30 text-green-500" />
                    </div>

                    <div className="mt-3 text-center sm:mt-5 w-full">
                        <h2 className="text-xl font-semibold">Platba ukončena</h2>
                        <p className="text-sm mt-2 text-primary-foreground tracking-tight">
                            Děkujeme že jste se stal odběratelem.
                        </p>

                        <Button asChild className="w-full mt-5">
                            <Link href="/paywall">Členská sekce</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}