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
                    <Input name="name" type="text" defaultValue={user?.name} disabled={isPending} />
                    <input type="hidden" name="id" value={user._id}/>
                    <Input name="surname" type="text" defaultValue={user?.surname} disabled={isPending} />
                   
                        <Input name="email" type="text" defaultValue={user?.email} disabled={isPending} />
                        <Input name="tel" type="tel" defaultValue={user?.tel} disabled={isPending} placeholder="Telefon" />

  <label className="flex items-center space-x-2">
    <input type="checkbox" name="souhlas" defaultChecked={user?.souhlas} disabled={isPending} />
    <span>Souhlasím se zasíláním newsletterů</span>
  </label>

  <Input name="country" type="text" defaultValue={user?.country} disabled={isPending} placeholder="Země" />
  <Input name="region" type="text" defaultValue={user?.region} disabled={isPending} placeholder="Kraj" />
  <Input name="postalCode" type="text" defaultValue={user?.postalCode} disabled={isPending} placeholder="PSČ" />
  <Input name="city" type="text" defaultValue={user?.city} disabled={isPending} placeholder="Město" />
  <Input name="address" type="text" defaultValue={user?.address} disabled={isPending} placeholder="Adresa" />

                        {user?.type === "bussiness" &&
                            <Input name="ico" type="text" defaultValue={user?.ico} />
                            
                        }
                        
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