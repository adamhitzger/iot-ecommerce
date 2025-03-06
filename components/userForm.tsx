"use client"
import { ActionResponse, Order, User } from "@/types";
import { useActionState } from "react";
import {  deleteAccount, signOut } from "@/actions/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Password from "./modals/pass";
import Details from "./modals/details";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react";
import {motion} from "motion/react"

export function UserOrderCard({ order }: { order: Order }) {
    const [isOpen, setIsOpen] = useState(false)
  
    const statusColor = {
      pending: "bg-yellow-500",
      processing: "bg-blue-500",
      shipped: "bg-green-500",
      delivered: "bg-green-700",
      cancelled: "bg-red-500",
    }
  
    return (
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <Badge className={`${statusColor[order.status as keyof typeof statusColor] || "bg-gray-500"}`}>
              {order.status}
            </Badge>
          </CardTitle>
          <CardDescription>
            Celkem: {order.total} Kč | Platba: {order.cod ? "Dobírka" : "Kartou online"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between">
                Souhrn
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="mt-2 space-y-2">
                {order.orderedProducts && order.orderedProducts.map((product, index) => (
                  <li key={index} className="flex justify-between">
                    <span>
                      {product.name} x{product.quantity}
                    </span>
                    <span>{product.price * product.quantity} Kč</span>
                  </li>
                ))}
              </ul>
              {order.couponValue > 0 && <p className="mt-2 text-right text-red-600">Sleva: {order.couponValue}%</p>}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
        <CardFooter className="justify-end">
          {order.invoice &&
            <Link href={order.invoice} target="_blank">
            <Button variant="outline" >
            Zobrazit fakturu
          </Button>
            </Link>
          }
          
        </CardFooter>
      </Card>
    )
  }
  
  
const actionState: ActionResponse<User> = {
    success: false,
    message: "",
}

export default function UserForm({user, changePass, changeNames, orders}: {user: User, changePass: string | undefined, changeNames: string | undefined, orders: Order[]}){
  
    const [
          // eslint-disable-next-line
        state, 
        action, 
        isPending] = useActionState(signOut, actionState);
    
    const [
        // eslint-disable-next-line
        state2, 
        action2, 
        isPending2
    ] = useActionState(deleteAccount, actionState);
    
    return(
        <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <motion.form 
    initial={{opacity: 0, y: -500}}
    animate={{opacity: 1, y: 0}}
    exit={{opacity: 0, y: -500}}
    transition={{duration: 0.5}}
    className="rounded-xl bg-primary-third p-6 grid grid-cols-2 h-fit  w-full  gap-5 justify-items-center content-end" autoComplete="on">
            <div className="w-full  flex flex-col space-y-4 col-span-2">
            <h1>Údaje</h1>
            </div>
            <div className=" grid grid-cols-1 sm:grid-cols-2 col-span-2 w-full">
                        <div>
                            <label htmlFor="email">Email</label>
                            <Input id="email"  type="text" defaultValue={user?.email} readOnly/>
                        </div>
                        <div>
                            <label htmlFor="name" >Celé jméno</label>
                            <Input id="name" type="text" defaultValue={`${user?.first_name} ${user?.last_name}`} readOnly/>
                        </div>
                        {user?.type === "b2b" &&
                            <div>
                            <label htmlFor="ico" >IČO</label>
                            <Input id="ico" type="text" defaultValue={user?.ico} readOnly/>
                        </div>
                        }
                              </div> 
                        <div className="col-span-2 ">
                        <div className="grid grid-cols-2 grid-rows-2 gap-4 justify-items-center">
                        <Link href={"/user?names=true"}>
                        <Button type="button" size={"sm"}  >{isPending ? <Loader2 className="animate-spin"/> : "Změnit údaje"}</Button>
                        </Link>
                        <Link href={"/user?pass=true"}>
                        <Button type="button" size={"sm"} >{isPending2 ? <Loader2 className="animate-spin"/> : "Změnit heslo"}</Button>
                        </Link>
                       
                        <Button type="submit" size={"sm"} variant={"outline"} formAction={action}>{isPending ? <Loader2 className="animate-spin"/> : "Odhlásit se"}</Button>
                        <Button type="submit" size={"sm"} variant={"outline"} formAction={action2}>{isPending2 ? <Loader2 className="animate-spin"/> : "Smazat účet"}</Button>
                        
                        </div>
                        </div>
                        
        </motion.form>

        <motion.div 
        initial={{opacity: 0, y: 500}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: 500}}
        transition={{duration: 0.5}}
        className="flex space-y-4 flex-col rounded-xl bg-primary-third p-6">
        <h1>Objednávky</h1>
      {orders.length > 0 ? (
        <div className="">
          {orders.map((order, i) => (
            <UserOrderCard key={i} order={order} />
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-600">Nemáte žadné objednávky...</p>
      )}
        </motion.div>
        </div>
        {changePass && <Password/>}
        {changeNames && <Details user={user}/>}
        </>
)
}