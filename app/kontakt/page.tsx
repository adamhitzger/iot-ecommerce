"use client"

import React, { useTransition, useState } from 'react';
import Map, { Marker } from "react-map-gl"
import 'mapbox-gl/dist/mapbox-gl.css';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { saveContact } from '@/actions/actions';

export default function Kontakt() {
    const [isPending, startTransition] = useTransition();
    const [form, setForm] = useState({
        name: "",
        email: "",
        tel: "",
        company: "",
        msg: "",
        rights: "",
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value })
    };

    const handleSendEmail = (formData: FormData) => {
        startTransition(async () => {
            await saveContact(formData)
            toast.success("Vaše zpráva byla odeslána, co nejdříve se Vám ozvu:");
            setForm({
                name: "",
                email: "",
                tel: "",
                company: "",
                msg: "",
                rights: "",
            })
        })
    }
    return(
        <div className='flex flex-col lg:flex-row gap-6'>
            <div className='lg:w-1/2 w-full rounded-lg shadow-lg shadow-secondary-foreground h-96 lg:h-auto bg-primary-third p-1'>
            <Map
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN!}
                    initialViewState={{
                        longitude: 15.5803,
                        latitude: 49.6053,
                        zoom: 17,
                    }}
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                
                >
                    <Marker longitude={15.5803} latitude={49.6053} anchor='bottom' color="red" />
                </Map>
            </div>
            <div>
            <form className="bg-primary-third p-4 lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 rounded-lg px-5 w-full gap-3 " action={handleSendEmail}>
                <div className='flex flex-col w-full space-y-2'>
                    <label>Celé jméno</label>
                    <Input name="name" type="text" placeholder="Zadejte celé jméno" value={form.name} onChange={handleChange} required disabled={isPending} />
                </div>
                <div >
                    <label>Email</label>
                    <Input name="email" type="email" placeholder="Zadejte email" value={form.email} onChange={handleChange} required disabled={isPending} />
                </div>
                <div >
                    <label>Telefonní číslo</label>
                    <Input name="tel" type='tel' placeholder="Zadejte telefonní číslo" value={form.tel} onChange={handleChange} required disabled={isPending} />
                </div>
                <div >
                    <label>Firma</label>
                    <Input name="company" type="text" placeholder="Zadejte Vaši firmu" value={form.company} onChange={handleChange} disabled={isPending} />
                </div>
                <div className='flex flex-col space-y-2 lg:col-span-2 w-full'>
                    <label>Zpráva</label>
                    <Textarea name='msg' placeholder="Zadejte Vaši zprávu" value={form.msg} onChange={handleChange} required disabled={isPending} />
                </div>
                <div className='flex flex-col justify-center lg:col-span-2 w-full space-y-6 py-5'>
                    <div className='flex flex-row  space-x-3'>
                        <Checkbox id="rights" name='rights' required/>
                        <label
                            htmlFor="rights"
                            className="text-lg font-light leading-none"
                        >
                            Souhlasím s Podmínkami a Zásadami ochrany osobních údajů
                        </label>
                        </div>
                    
                    </div>
                    <div className='sm:place-self-center sm:col-span-2'>
                        <Button type="submit" variant={"default"} size={'lg'} className='mx-auto' >{isPending ? <Loader2 className='animate-spin' /> : <>Odeslat </>}</Button>
                        </div>
                </form>
            </div>
        </div>
    )
}