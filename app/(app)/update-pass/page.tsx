"use client"
import { ActionResponse, SignIn, } from "@/types";
import { useActionState, useEffect, Suspense } from "react";
import { updateForgotPass } from "@/actions/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

const actionState: ActionResponse<SignIn> = {
    success: false,
    message: "",
}

function ForgotForm(){
    const searchParams = useSearchParams()
   const code = searchParams.get("code") as string
const [state, action, isPending] = useActionState(updateForgotPass, actionState);
    
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
            <h1>Aktualizace hesla</h1>
            <span>Povinné údaje: *</span>
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
                            <label htmlFor="password" >Heslo*</label>
                            <Input id="password"  name="password"  type="password" placeholder="Zadejte heslo"/>   
                        </div>
                        <input type="hidden" value={code} name="code"/>
                        <div className="flex flex-col col-span-2 items-center justify-end">
                    <Button type="submit" formAction={action}>{isPending ? <Loader2 className="animate-spin"/> : "Odeslat"}</Button>
            </div>
        </form>
    )
}

export default function UpdatePass(){
   
    
return(
    <Suspense>
        <ForgotForm/>
    </Suspense>
    )
}