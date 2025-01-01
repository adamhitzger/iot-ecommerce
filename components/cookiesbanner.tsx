'use client'

import { useState, useEffect, useTransition } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Checkbox } from '@/components/ui/checkbox'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react';

export default function CookiesBanner() {
    const [isVisible, setIsVisible] = useState(false)
    const [isPending, startTransition] = useTransition();
    useEffect(() => {
        const hasAgreed = localStorage.getItem('provoz')
        if (!hasAgreed) {
            setIsVisible(true)
        }
    }, [])

    
    
    const setCookie= (formData: FormData) => {
        startTransition(async () => {
            await function setData(formData: FormData) {
              const personal = formData.get("personal");
              localStorage.setItem('personal', personal)
              const provoz = formData.get("provoz");
              localStorage.setItem('provoz', provoz)
              const analytics = formData.get("analytics");
              localStorage.setItem('analytics', 'analytics')
            }
            toast.success("Děkujeme");
            
        })
        setIsVisible(false);
    }
    if(!isVisible) return null
    else return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-secondary-foreground rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6 text-primary-foreground">
                   
                        <h2 className="text-2xl font-bold ">Cookies</h2>
                        
                    <p className=" mb-6">
                        Používáme cookies pro lepší provoz naší stránky
                    </p>
                    <form action={setCookie} className='flex flex-col space-y-4'>
                   
    <div className="flex items-center space-x-2">
      <Checkbox id="personal" />
      <label
        htmlFor="personal"
        name="personal"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
      >
        Uložení preferencí uživatele
      </label>
    </div>
    <div className="flex items-center space-x-2">
      <Checkbox id="provoz" checked/>
      <label
        htmlFor="provoz"
        name="provoz"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Umožnění provozu stránky
      </label>
    </div>
    <div className="flex items-center space-x-2">
      <Checkbox id="analytics" />
      <label
        htmlFor="analytics"
        name="analytics"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Shromažďování analytických údajů 
      </label>
    </div>
    <Button name='submit'>{isPending ? <Loader2 className='animate-spin' /> : <>Odeslat</>}</Button>
                    </form>
                    </div>
                </div>
            </div>
    )
}