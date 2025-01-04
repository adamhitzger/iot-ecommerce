"use client"
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { saveNewsletter } from '@/actions/actions';

export default function Newsletter(){
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
    });

    const handleSaveMail = (formData: FormData) => {
        startTransition(async () => {
            await saveNewsletter(formData)
            toast.success("Vaše údaje byly uloženy");
            setForm({
                name: "",
                surname: "",
                email: "",
            })
        })
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })
    };
    
    return(
        <div className='p-3 rounded-lg bg-secondary-foreground flex flex-col space-y-3'>
            <h1 className='text-xl font-medium text-center'>Nechcete si nechat ujít nově naskladněné produkty? Přihlaste se k newsletteru! </h1>
        <form className="w-full  flex flex-col sm:flex-row   gap-6 items-center" action={handleSaveMail} id='newsletter'>
            <Input className='w-full ' name="name" type="text" placeholder="Zadejte jméno" value={form.name} onChange={handleChange} required />
            <Input className='w-full ' name="surname" type="text" placeholder="Zadejte přijmení" value={form.surname} onChange={handleChange} required />
            <Input className='w-full ' name="email" type="email" placeholder="Zadejte email" value={form.email} onChange={handleChange} required />
            <Button type="submit"  >{isPending ? <Loader2 className='animate-spin' /> : <>Odeslat</>}</Button>
        </form>
        <p className='text-sm text-center'>Přihlášením k odběru souhlasíte se zpracováním osobních údajů. Více informací <Link href='/souhlast' className="underline" target="_blank">zde</Link> </p>
        </div>
    )
}