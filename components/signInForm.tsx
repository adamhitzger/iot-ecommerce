"use client"
import { ActionResponse, SignIn } from "@/types";
import { useActionState, useEffect } from "react";
import { signInFn } from "@/actions/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import {motion} from "motion/react"

const actionState: ActionResponse<SignIn> = {
    success: false,
    message: "",
}

export default function SignInForm(){
    const [state, action, isPending] = useActionState(signInFn, actionState);
    
    useEffect(() => {
        if (state.message && !state.success) {
            toast.error(state.message);
        }else if(state.success){
          toast.success(state.message);
        }
    }, [ state.success, state.message]); 
return(
    <motion.form 
    initial={{opacity: 0, y: -500}}
    animate={{opacity: 1, y: 0}}
    exit={{opacity: 0, y: -500}}
    transition={{duration: 0.5}}
    className="rounded-xl bg-primary-third p-6 flex flex-col m-auto w-full md:w-1/2 gap-5 justify-items-center content-end" autoComplete="on">
            <div className="w-full flex flex-col space-y-4  col-span-2">
            <h1>Přihlášení</h1>
            <span>Povinné údaje: *</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4">
                        <div>
                            <label htmlFor="email">Email*</label>
                            <Input id="email" name="email" type="text" defaultValue={state?.inputs?.email} placeholder="Zadejte email"/>
                            {state?.errors?.email && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.email}
                               </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="pass" >Heslo*</label>
                            <Input id="pass"  name="pass"  type="password" placeholder="Zadejte heslo"/>
                            {state?.errors?.email && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.email}
                               </p>
                            )}
                            
                        </div>
                        </div>
                        <div className="flex flex-col col-span-2 items-center justify-end">
                        <Button type="submit" formAction={action}>{isPending ? <Loader2 className="animate-spin"/> : "Odeslat"}</Button>
                        </div>
                        <div className="w-full col-span-2 text-center text-sm">
                            <p>Přihlášením k odběru souhlasíte se zpracováním osobních údajů. Více informací <Link href="/souhlas" className="underline decoration-wavy decoration-secondary">zde</Link>.</p>
                            <p>Zapomněli jste heslo? Obnovte ho <Link href="/signin?forgot=true" className="underline decoration-wavy decoration-secondary"> zde</Link></p>
                            <p>Nemáte vytvořený účet? Registrujte se <Link href="/signup" className="underline decoration-wavy decoration-secondary"> zde</Link></p>
                        </div>
        </motion.form>
      
)
}