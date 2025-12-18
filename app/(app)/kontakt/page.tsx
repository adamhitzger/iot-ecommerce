"use client"

import { useEffect, useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { saveContact } from '@/actions/actions';
import { ActionResponse, Contact } from '@/types';
import Newsletter from '@/components/newsletter';
import {motion} from "motion/react"

const actionState: ActionResponse<Contact> = {
    success: false,
    message: ""
}

export default function Kontakt() {
    const [state, action, isPending] = useActionState(saveContact, actionState)

    useEffect(() => {
        if (!state.success && state.message.length > 1 ) {
            toast.error(state.message);
        }else if(state.success && state.message.length > 1){
            toast.success("Vaše zpráva byla odeslána, co nejdříve se Vám ozvu:"); 
        }
        
    }, [state.success,, state.message]);
    return(
        <>
        <div 
        className='grid grid-cols1 lg:grid-cols-2 gap-6 w-full'>
            <motion.div 
            initial={{opacity: 0, y: -500}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -500}}
            transition={{duration: 0.5}}
            className='w-full rounded-lg shadow-lg shadow-secondary-foreground h-96 lg:h-auto bg-primary-third p-1'>
              <iframe className='w-full h-auto' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2689.9602122521806!2d15.577702512004555!3d49.60540914772845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470d0095718c4907%3A0x1603022d3f361fd7!2zxb1pxb5rb3ZhIDI4MCwgNTgwIDAxIEhhdmzDrcSNa8WvdiBCcm9kIDE!5e1!3m2!1scs!2scz!4v1765979103645!5m2!1scs!2scz" width="600" height="450"  loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </motion.div>
            <motion.div
                initial={{opacity: 0, y: 500}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 500}}
                transition={{duration: 0.5}}
            >
            <form className="bg-primary-third p-4  grid grid-cols-1 sm:grid-cols-2 rounded-lg px-5  w-full gap-3 " autoComplete="on" action={action}>
                <div className='flex flex-col w-full space-y-2'>
                    <label>Jméno*</label>
                    <Input name="name" type="text" placeholder="Zadejte jméno" defaultValue={state.inputs?.name} disabled={isPending} />
                    {state?.errors?.name && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.name}
                               </p>
                            )}
                </div>
                <div className='flex flex-col w-full space-y-2'>
                    <label>Přijmení*</label>
                    <Input name="surname" type="text" placeholder="Zadejte přijmení" defaultValue={state.inputs?.surname} disabled={isPending} />
                    {state?.errors?.surname && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.surname}
                               </p>
                            )}
                </div>
                <div >
                    <label>Email*</label>
                    <Input name="email" type="email" placeholder="Zadejte email" defaultValue={state.inputs?.email} disabled={isPending} />
                    {state?.errors?.email && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.email}
                               </p>
                            )}
                </div>
                <div >
                    <label>Telefonní číslo*</label>
                    <Input name="tel" type='tel' placeholder="Zadejte telefonní číslo" defaultValue={state.inputs?.tel} disabled={isPending} />
                    {state?.errors?.tel && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.tel}
                               </p>
                            )}
                </div>
                
                <div className='flex flex-col space-y-2 lg:col-span-2 w-full'>
                    <label>Zpráva*</label>
                    <Textarea name='msg' placeholder="Zadejte Vaši zprávu" defaultValue={state.inputs?.msg} disabled={isPending} />
                    {state?.errors?.msg && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.msg}
                               </p>
                            )}
                </div>
                <div className='flex flex-col justify-center lg:col-span-2 w-full space-y-6 py-5'>
                    <div className='flex flex-row  space-x-3'>
                        <Checkbox id="rights" name='rights' required defaultChecked/>
                        <label
                            htmlFor="rights"
                            className="text-lg font-light leading-none"
                        >
                            Souhlasím s Podmínkami a Zásadami ochrany osobních údajů
                        </label>
                        </div>
                    
                    </div>
                    <div>
                        <span>Povinné údaje: *</span>
                    </div>
                    <div className='sm:place-self-center sm:col-span-2'>
                        <Button type="submit" variant={"default"} size={'lg'} className='mx-auto' >{isPending ? <Loader2 className='animate-spin' /> : <>Odeslat </>}</Button>
                        </div>
                </form>
            </motion.div>
        </div>
        <Newsletter/>
        </>
    )
}