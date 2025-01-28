"use client"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useActionState } from "react"
import { ActionResponse, User } from "@/types";
import toast from "react-hot-toast"
import { updateUser } from "@/actions/actions"

const actionState: ActionResponse<User> = {
    success: false,
    message: "",
}

export default function Details({user}: {user: User}){
    const router = useRouter();
    const [state, action, isPending] = useActionState(updateUser, actionState);
    
    useEffect(() => {
        if (!state.success && state.message) {
            toast.error(state.message);
        }else{
          toast.success(state.message);
        }
    }, [state.success, state.message]); 
    return(
        <div className="fixed inset-0 bg-primary-third bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="p-8 border w-96 shadow-lg rounded-lg bg-primary">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-primary-foreground">Zadejte Vaše údaje</h3>
                    <form className="space-y-4">
                    <Input name="name" type="text" defaultValue={user?.first_name} disabled={isPending} />
                    {state?.errors?.first_name && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.first_name}
                               </p>
                            )}
                    <Input name="surname" type="text" defaultValue={user?.last_name} disabled={isPending} />
                    {state?.errors?.last_name && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.last_name}
                               </p>
                            )}
                        <Input name="email" type="text" defaultValue={user?.email} disabled={isPending} />
                        {state?.errors?.email && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.email}
                               </p>
                            )}
                        {user?.type === "b2b" &&
                            <Input name="ico" type="text" defaultValue={user?.ico} />
                            
                        }
                        {user?.type === "b2b" && state?.errors?.first_name && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.ico}
                               </p>
                            )}
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