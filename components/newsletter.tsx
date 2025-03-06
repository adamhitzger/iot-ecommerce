"use client"
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useActionState, useEffect, useRef} from 'react'
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { saveNewsletter } from '@/actions/actions';
import { Newsletter as N, ActionResponse } from '@/types';
import { useInView, motion } from 'motion/react';
const actionState: ActionResponse<N> = {
    success: false,
    message: ""
}

export default function Newsletter(){
    const ref = useRef(null)
    const inView = useInView(ref)
    const [state, action, isPending] = useActionState(saveNewsletter, actionState);
    useEffect(() => {
        if (!state.success && state.message) {
            toast.error(state.message);
        }else{
          toast.success(state.message);
        }
    }, [state.success, state.message]); 
    return(
        <motion.div 
        initial={{opacity: 0, x: -500}}
        animate={inView?{opacity: 1, x: 0}: {}}
        exit={{opacity: 0, x: -500}}
        transition={{duration: 0.5}}
        ref={ref}
        className='p-3 rounded-lg bg-secondary-foreground flex flex-col space-y-3'>
            <h2 className='text-xl font-medium text-center'>Nechcete si nechat ujít nově naskladněné produkty? Přihlaste se k <span className='underline decoration-wavy decoration-secondary'>newsletteru!</span> </h2>
        <form className="w-full  flex flex-col sm:flex-row   gap-6 items-center" action={action} id='newsletter'>
            <div className='flex flex-col space-y-2'><Input className='w-full ' name="name" type="text" placeholder="Zadejte jméno" />
            {state?.errors?.name && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.name}
                               </p>
                            )}
            </div>
            <div className='flex flex-col space-y-2'> <Input className='w-full ' name="surname" type="text" placeholder="Zadejte přijmení"/>
            {state?.errors?.surname && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.surname}
                               </p>
                            )}
            </div>
            <div className='flex flex-col space-y-2'><Input className='w-full ' name="email" type="email" placeholder="Zadejte email"  />
            {state?.errors?.email && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.email}
                               </p>
                            )}
            </div>

            <Button type="submit"  >{isPending ? <Loader2 className='animate-spin' /> : <>Odeslat</>}</Button> 
              </form>
             
              <p className='text-sm text-center'>Přihlášením k odběru souhlasíte se zpracováním osobních údajů. Více informací <Link href='/souhlas' className="underline decoration-wavy decoration-secondary underline-offset-2" target="_blank">zde</Link> </p>
      
        </motion.div>
    )
}