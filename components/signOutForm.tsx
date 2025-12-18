"use client"
import { ActionResponse, SignIn } from "@/types";
import { useActionState, useEffect } from "react";
import { signOutFromNewsletter } from "@/actions/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {motion} from "motion/react"
import { use } from 'react'
const actionState: ActionResponse<SignIn> = {
    success: false,
    message: "",
}
export default function SignOutFromComp({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}){
    const [state, action, isPending] = useActionState(signOutFromNewsletter, actionState);
    
    const emailParam = use(searchParams);
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
            <h1>Ohlášení z newsletteru</h1>
            <span>Povinné údaje: *</span>
            </div>
            <div className="grid grid-cols-1 sm:gap-4">
                        <div>
                            <label htmlFor="email">Email*</label>
                            <Input id="email" name="email" type="text" defaultValue={emailParam.email ? emailParam.email :state?.inputs?.email} placeholder="Zadejte email"/>
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
                       
        </motion.form>
)
}
