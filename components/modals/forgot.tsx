"use client"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useActionState } from "react"
import { ActionResponse } from "@/types";
import toast from "react-hot-toast"
import { forgotPass } from "@/actions/actions"

const actionState: ActionResponse<{email: string}> = {
    success: false,
    message: "",
}

export default function Forgot(){
    const router = useRouter();
    const [state, action, isPending] = useActionState(forgotPass, actionState);
    
    useEffect(() => {
        if (!state.success) {
            toast.error(state.message);
        }else{
          toast.success(state.message);
        }
    }, [state.success, state.message]); 
    return(
        <div className="fixed inset-0 bg-primary-third bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="p-8 border w-96 shadow-lg rounded-lg bg-primary">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-primary-foreground">Zadejte email, na který Vám zašleme link na obnovu hesla</h3>
                    <form className="space-y-4">
                        <Input name="email" placeholder="Zadejte email" type="text" disabled={isPending} />
                        <div className="flex flex-row justify-around items-center">
                            <Button
                                
                                disabled={isPending} type="submit"
                                size={"lg"}
                                formAction={action}
                            >
                                {isPending ? <Loader2 className={"animate-spin"} /> : "Poslat"}
                            </Button>
                            <Button
                                variant={"outline"}
                                onClick={router.back}
                                size={"lg"}
                            > 
                                Zpět
                            </Button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}