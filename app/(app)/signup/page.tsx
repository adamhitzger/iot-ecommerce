"use client"
import { ActionResponse, User } from "@/types";
import { useActionState, useEffect } from "react";
import { signUp } from "@/actions/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
const actionState: ActionResponse<User> = {
    success: false,
    message: "",
}

export default function SignUpPage(){
    const [state, action, isPending] = useActionState(signUp, actionState);
    
      useEffect(() => {
        if (!state.success) {
            toast.error(state.message);
        }else{
          toast.success(state.message);
        }
    }, [state.success, state.message]); 
    return(
        <form className="rounded-xl bg-primary-third p-6 grid grid-cols-2 m-auto w-full md:w-1/2 gap-5 justify-items-center content-end" autoComplete="on">
            <div className="w-full flex flex-col space-y-4  col-span-2">
            <h1>Registrace</h1>
            <span>Povinné údaje: *</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 col-span-2">
            <div>
                            <label htmlFor="name">Jméno*</label>
                            <Input id="name" name="name" type="text" defaultValue={state?.inputs?.first_name} placeholder="Zadejte jméno"/>
                            {state?.errors?.first_name && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.first_name}
                               </p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="surname">Přijmení*</label>
                            <Input id="surname" name="surname" type="text" defaultValue={state?.inputs?.last_name} placeholder="Zadejte přijmení"/>
                            {state?.errors?.last_name && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.last_name}
                               </p>
                            )}
                        </div>
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
                        <div>
                            <label htmlFor="ico" >IČO pro B2B</label>
                            <Input id="ico"  name="ico"  type="text" defaultValue={state?.inputs?.ico} placeholder="Zadejte IČO"/>
                            {state?.errors?.ico && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.ico}
                               </p>
                            )}
                            
                        </div>
                        <div className="flex flex-col items-center justify-end">
                        <Button type="submit" formAction={action}>{isPending ? <Loader2 className="animate-spin"/> : "Odeslat"}</Button>
                        </div>
                        </div>
                        <div className="w-full col-span-2 text-center text-sm">
                            <p>Přihlášením k odběru souhlasíte se zpracováním osobních údajů. Více informací <Link className="underline decoration-wavy decoration-secondary" href="/souhlas">zde</Link>.</p>
                            <p>Máte vytvořený účet? Přihlaste se <Link className="underline decoration-wavy decoration-secondary" href="/signin"> zde</Link></p>
                        </div>
        </form>
    )
}