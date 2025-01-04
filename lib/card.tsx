"use client";
import React, { createContext, useContext, useState, useEffect } from 'react'

export type CartItem = {
    id: string
    name: string
    price: number
    variant: string
    terpens: string
    quantity: number
}

type CartContextType = {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (terpens: string, variant: string) => void
    updateQuantity: (terpens: string, variant: string, quantity: number) => void
    clearCart: () => void
    total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [total, setTotal] = useState(0)

    useEffect(() => {
        const newTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        setTotal(newTotal)
    }, [items])

    const addItem = (newItem: CartItem) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.terpens === newItem.terpens && item.variant === newItem.variant)
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prevItems, newItem]
        })
    }

    const removeItem = (terpens: string, variant: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.terpens !== terpens || item.variant !== variant))
    }

    const updateQuantity = (terpens: string, variant: string, quantity: number) => {
        setItems((prevItems) =>
            prevItems.map((item) => (item.terpens === terpens && item.variant === variant ? { ...item, quantity } : item))
        )
    }

    const clearCart = () => {
        setItems([])
    }

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}