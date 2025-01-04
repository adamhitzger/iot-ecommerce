"use client"

import { useState } from 'react'
import { X } from 'lucide-react'
import { useCart } from '@/lib/card'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'

export default function Basket() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCart()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <div className="relative px-5">
                    <Image height={32} width={32} src={"/images/bong.svg"} alt='Bong logo Hydroocann Natural' />
                    {items.length > 0 && (
                        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-primary bg-primary-foreground text-xs flex items-center justify-center">
                            {items.length}
                        </span>
                    )}
                    <span className="sr-only">Open cart</span>
                </div>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Váš košík</SheetTitle>
                </SheetHeader>
                {items.length === 0 ? (
                    <p className="text-center text-muted-foreground mt-4">je prázdný...</p>
                ) : (
                    <div className="mt-8 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between space-x-4">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium">{item.name} {item.terpens}</h3>
                                    <p className="text-sm text-muted-foreground">{item.variant}</p>
                                    <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} Kč</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item.terpens, item.variant, parseInt(e.target.value, 10))}
                                        className="w-16"
                                    />
                                    <Button variant="outline" size="icon" onClick={() => removeItem(item.terpens, item.variant)}>
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Odstranit</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <div className="border-t pt-4">
                            <div className="flex justify-between">
                                <span className="font-medium">Total:</span>
                                <span className="font-medium">{total.toFixed(2)} Kč</span>
                            </div>
                        </div>
                        <div className="flex justify-between space-x-4">
                            <Button variant="outline" onClick={clearCart}>Vyčistit košík</Button>
                            <Link href={"/checkout"}><Button>Zaplatit</Button></Link>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}