"use client"

import { useCart } from "@/lib/card"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useActionState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { createOrder, validateCoupon } from "@/actions/actions"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, X } from "lucide-react"
import { ActionResponse, Order } from "@/types"
import {motion} from "motion/react"
declare global {
    interface Window {
        // eslint-disable-next-line
        Packeta: any;
    }
}

const actionState: ActionResponse<Order> = {
    success: false,
    message: ""
}

export default function CheckouPage(){
    const date = new Date()
    const now = `${date.getFullYear()}${date.getMonth()+1 >9 ? date.getMonth()+1:"/0"+date.getMonth()+1}${date.getDate()>9?date.getDate():"/0"+date.getDate()}`
    const {items, removeItem, updateQuantity, total, clearCart } = useCart()
    const [packetaPoint, setPacketaPoint] = useState<{id: number, street: string}>({id: 0, street: ""});
    const [coupon, setCoupon] = useState({
        code: "",free_del: false, value: 0, sale: false
    })
    const [state, action, ispending] = useActionState(createOrder, actionState)
  
      useEffect(() => {
        if (!state.success && state.message) {
            toast.error(state.message);
        }else if(state.success){
            toast.success("Úspěšně jste provedli objednávku");
            clearCart();
        }
        
    }, [state.success, clearCart, state.message]); 
        const del = coupon.free_del ? 0 : 89

        async function addCoupon(formData: FormData) {
                    const result = await validateCoupon(formData);
                    const code = String(result?.vCoupon?.code)
                    const free_del = Boolean(result?.vCoupon?.free_del)
                    const value = Number(result?.vCoupon?.value)
                    if(result && result.vCoupon){
                        toast.success("Kupon byl přidán");
                        console.log("Kod: ", code)
                        setCoupon({code: code, value: value, free_del: free_del, sale: true})
                    }else{
                        toast.error("Neplatný kupón")
                    }
                
            }

            async function delCoupon() {
                        toast.success("Kupon byl smazán")
                        setCoupon({code: "",free_del: false, value: 0, sale: false})
            }

    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://widget.packeta.com/v6/www/js/library.js'
        script.async = true
        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    const showPacketaWidget = () => {
        if (window.Packeta) {
            const packetaApiKey = process.env.PACKETA_API_KEY;
            const packetaOptions = {
                packetConsignment: "true",
                livePickupPoint: "true",
                valueFormat: "id,city,street,zip",
                view: "modal"
            }
            // eslint-disable-next-line
            window.Packeta.Widget.pick(packetaApiKey, (point: any) => {
                if (point) {
                    const [id,street] = point.formatedValue.split(',');
                    setPacketaPoint({id, street});
                }
            }, packetaOptions)
        }
    }
    console.log(coupon.value)
      const celkem = Math.ceil((del + total -(total/100*coupon.value)))
     return(
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8" autoComplete="on">
            <motion.div 
            initial={{opacity: 0, y: -500}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -500}}
            transition={{duration: 0.5}}
            className="w-full flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">Souhrn objednávky</h2>
                    {items.map((item, idx: number) => (
                        <div key={idx} className="flex items-center justify-between mb-4 p-4 border rounded-xl">
                            <div className="flex-1">
                            <div className="flex flex-row gap-2">
                           
                           
                                <Input type="text" name={`pname${idx}`}  value={item.name} readOnly className="mb-2" disabled={ispending} />
                                
                                <Input
                                type="number"
                                value={item.quantity}
                                name={`quan${idx}`}
                                onChange={(e) => updateQuantity(item.terpens, item.variant, parseInt(e.target.value))}
                                className="w-20 ml-4"
                                min="1"
                                disabled={ispending}
                            />
                            <Button variant="outline"  className="bg-red-500 border-0" size="icon" onClick={() => removeItem(item.terpens, item.variant)}>
                                        <X className="h-4 w-4 text-white" />
                                        <span className="sr-only">Odstranit</span>
                                    </Button>
                                    </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <Input type="text" name={`variant${idx}`} value={item.variant} readOnly disabled={ispending} />
                                    <Input type="text" name={`terpens${idx}`} value={item.terpens} readOnly disabled={ispending} />
                                    <Input type="text" name={`price${idx}`} value={`${item.price} Kč`} readOnly disabled={ispending} />
                                    
                                    <Input type="hidden" name={`id${idx}`} value={item.id} readOnly className="mb-2" disabled={ispending} />
                                </div>
                            </div>
                            
                        </div>
                    ))}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-semibold mb-4">Slevový kupon</h2>
                        <div className="flex flex-col space-y-2">
                   <Input id="coupon" name="coupon" type="text" defaultValue={coupon.code} placeholder="Zadejte kód kupónu" disabled={ispending} />
                   {coupon.sale ? <Button type="submit" formAction={delCoupon} variant={"outline"} disabled={ispending}>{ispending ? <Loader2 className='animate-spin' /> :"Smazat kupon"}</Button>: <Button type='submit' formAction={addCoupon} disabled={ispending}>{ispending ? <Loader2 className='animate-spin' /> :"Ověřit kupon"}</Button>}
                        </div>
                        </div>
                      <div className="text-xl font-semibold mt-4">Doprava: {del} Kč</div>
                    <div className="text-xl font-semibold mt-4">Celkem: {coupon.sale ? <span className="text-red-600 line-through font-bold">{total} Kč</span> : null}  {celkem } Kč</div>
                
            </motion.div>
            <motion.div 
            initial={{opacity: 0, y: 500}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 500}}
            transition={{duration: 0.5}}
            className="w-full flex flex-col">
            <div className="flex flex-row space-x-2">
           
                       </div>
            <h2 className="text-2xl font-semibold mb-4">Vaše údaje:</h2>
                    <span>Povinné údaje: *</span>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email">Email*</label>
                            <Input id="email" name="email" type="email"   placeholder="Zadejte email" />
                            
                        </div>
                        <div>
                            <label htmlFor="phone">Telefonní číslo*</label>
                            <Input id="phone" name="phone" type="tel"  placeholder="Zadejte telefonní číslo"/>
                           
                        </div>
                        <div>
                            <label htmlFor="name">Jméno*</label>
                            <Input id="name" name="name" type="text"  placeholder="Zadejte jméno"/>
                            
                        </div>
                        <div>
                            <label htmlFor="surname">Přijmení*</label>
                            <Input id="surname" name="surname" type="text"  placeholder="Zadejte přijmení"/>
                            
                        </div>
                        <div>
                            <label htmlFor="country">Země*</label>
                            <Input id="country" name="country" type="text" value={"Česká republika"}  readOnly />
                        </div>
                        <div>
                            <label htmlFor="street">Ulice a číslo popisné*</label>
                            <Input id="address" name="address" type="text"   placeholder="Zadejte adresu"/>
                            
                        </div>

                        <div>
                            <label htmlFor="city">Obec*</label>
                            <Input id="city" name="city" type="text"  placeholder="Zadejte obec"/>
                            
                        </div>
                        <div>
                            <label htmlFor="region">Kraj*</label>
                            <Input id="region" name="region" type="text"  placeholder="Zadejte kraj"/>
                            
                        </div>
                        <div>
                            <label htmlFor="postalCode">PSČ*</label>
                            <Input id="postalCode" name="postalCode" type="text"  placeholder="Zadejte PSČ"/>
                            
                            <Input id="packetaId" name="packetaId" type="hidden" defaultValue={state?.inputs?.packetaId} value={packetaPoint.id} />
                            
                            <Input  name="total" type="hidden"  value={celkem}/>
                            <Input  name="couponValue" type="hidden"  value={coupon.value}/>
                            <Input  name="del" type="hidden"  value={del}/>
                            <Input  name="date" type="hidden" value={now} />
                            <Input type="hidden" name="length" value={`${items.length}`} readOnly disabled={ispending}/>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-10">
                    <div className="flex flex-col gap-4">
                        
                        <div >
                        <h2 className="text-2xl font-semibold mb-4">Doprava</h2>
                            <Button type='button' onClick={showPacketaWidget}>Vyberte Zásilkovnu</Button>
                            <h3>{packetaPoint.street}</h3>
                            {state?.errors?.packetaId && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state.errors.packetaId}
                               </p>
                            )}
                        </div>
                        <div className='bg-gray-300 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 p-5'>
                        <h2 className="text-2xl font-semibold mb-4">Platba</h2>
                        <div className="flex-col items-end space-y-2">
                        <label htmlFor="cod">Vyberte platbu:</label>
                        <RadioGroup name="cod" id="cod" disabled={ispending} defaultValue={state?.inputs?.cod} className="flex flex-col space-y-4">
                                <div className="space-x-3">
                               
                                <RadioGroupItem value={"true"} className="border-white"/>
                                <label >Dobírkou při přebíraní balíčku</label>
                                </div>
                                <div className="space-x-3">
                               
                                <RadioGroupItem value={"false"} className="border-white"/>
                                <label >Bankovním převodem</label>
                                </div>
                        </RadioGroup>
                        </div>
                        <div className="mt-8">
                  </div>
                        </div>
                    </div>
                    <div className='bg-gray-300 flex flex-col space-y-2 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 p-5'>
                        <p>Account Number: 123-7895890287/0100</p>
                        <p>Bank: Example Bank</p>
                        <p>IBAN: CZ1234567890123456789012</p>
                        <hr className='h-0.5 bg-muted my-3' />
                        <h3 className="text-xl font-semibold mb-2">QR Platba</h3>
                        <Image
                            src={`https://api.paylibo.com/paylibo/generator/czech/image?accountPrefix=123&accountNumber=7895890287&bankCode=0100&amount=${celkem}&currency=CZK`}
                            alt="QR platba"
                            width={200}
                            height={200}
                        />
                        <Button size="lg" type="submit" formAction={action} className="w-full text-base" disabled={total === 0}>{ispending ? <Loader2 className='animate-spin' /> : "Odeslat objednávku"}</Button>
          
                    </div>
                    
                </div>
            </motion.div>
            
        </form>
    )
}