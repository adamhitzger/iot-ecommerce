"use client";

import { components } from "@/sanity/lib/components";
import { Product, Review, Reviews,  ActionResponse } from "@/types";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useState,  useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, StarIcon } from "lucide-react";
import { useCart } from "@/lib/card";
import { createBasket, saveReview } from "@/actions/actions";
import { Textarea } from "./ui/textarea";
import toast from "react-hot-toast";

const reviewState: ActionResponse<Review> = {
    success: false,
    message: ""
}

export default function ProductComponent({product, reviews}: {product: Product, reviews?: Reviews}){
    const { addItem } = useCart();
    const user = false;
    const {
        _id,
        name,
        sale,
        overview,
        category,
        picture,
        details,
        pictures,
        terpens,
        variants,
        price
    } = product;
    const allPictures = [picture, ...pictures]
    
    const [curImg, setCurImg] = useState<number>(0);
    const [prise, setPrice] = useState<number>(price);
    
    const handleVariantsChange = (variant: string) => {
        const selectedVariant = variants.find((v) => v.slug === variant);
        if (selectedVariant) {
            if(user){setPrice(selectedVariant.price_b2c)} else { setPrice(selectedVariant.price_b2b)} 
            console.log(selectedVariant.v_name)
    }
      }   
    async function addToBasket(formData: FormData){
        const item = await createBasket(formData)
        if(item.success && item.item){
            addItem({
                id: item.item._id,
                name: item.item.name,
         price:  item.item.price,
         terpens:  item.item.terpen,
         quantity:  item.item.quantity,
         variant:  item.item.variant,
            })
            toast.success("Produkt byl přidán do košíku")
        }
        
    }
   const [state2, action2, isPending2] = useActionState(saveReview, reviewState)
   useEffect(() => {
    if (!state2.success && state2.message) {
        toast.error(state2.message);
    }else if(state2.success){
        toast.success("Úspěšně jste provedli objednávku");
        
    }
    
}, [state2.success, state2.message]);
    return(
        <section className="grid  sm:grid-cols-2 xl:grid-cols-3 gap-8">
            <div className="w-full flex flex-col space-y-2">
            <div className="w-full relative aspect-square ">
                <Image src={allPictures[curImg]} alt={`${name} - ${overview}`} fill={true} className="rounded-lg object-cover"/>
                </div>
                
                <div className=" flex flex-row  flex-wrap gap-2">
                    {allPictures.map((p: string, i: number) => (
                        <div key={i} className="w-16 h-16 sm:w-32 sm:h-32 relative ">                        
                            <Image src={p} alt={name}  onClick={()  => setCurImg(i)}  fill={true} className={`rounded-lg object-cover ${i === curImg ? "border-secondary border-2" : null}`}/>  
                            </div>                
                    ))}
                </div>
            </div>
            <div className="w-full flex flex-col text-lg text-right space-y-4 items-end">
                <h1 className="text-6xl font-bold">{name}</h1>
                <Link href={`/products/?name=${category.slug}`} className="underline underline-offset-2 text-2xl">{category.name}</Link>
                <div className="flex flex-row text-3xl font-medium space-x-3">
                    <span className={`${sale ? "text-red-600 line-through font-bold" : null}`}>{prise} Kč</span> {sale ? <span>{(1-(sale/100)) * prise } Kč</span> : null}
                </div>
                <PortableText components={components} value={details}/>
                
                 
                <form className="flex flex-col justify-end">
                    <div className="flex-col items-end ">
                        <label htmlFor="terpens">Příchutě:</label>
                        <RadioGroup required name="terpen" id="terpens"  className="flex flex-row space-x-4 flex-wrap">
                
                            {terpens && terpens.map((t, i) => (
                                <div key={i} className="flex flex-row space-x-2">
                                    <div className="w-4 h-4 rounded-full" style={{background: `rgba(${t.color.rgb.r},${t.color.rgb.g},${t.color.rgb.b},${t.color.rgb.a})`}}></div>
                                <label htmlFor={t.slug}>{t.t_name}</label>
                                <RadioGroupItem value={t.slug} className="border-white"/>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                    <div className="flex-col items-end ">
                        <label htmlFor="variants" >Varianty:</label>
                        <RadioGroup
                        className="flex flex-row space-x-4 flex-wrap" 
                        name="variant" 
                        id="variants" 
                        onValueChange={handleVariantsChange}
                        required
                        >
                            {variants && variants.map((v, i) => (
                                <div key={i} className="flex flex-row space-x-2">
                                <label htmlFor={v.slug}>{v.v_name}</label>
                                <RadioGroupItem value={v.slug} className="border-white" />
                                
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                    <div className="flex flex-row justify-end items-end w-full  space-x-4">
                        <Input name="quantity" type="number" min={"1"}  defaultValue={1} className="w-12" required/>
                        <input type="hidden" name="_id" value={_id} required readOnly/>
                        <input type="hidden" name="name" value={name} required readOnly/>
                        <input type="hidden" name="price" value={sale ? (1-(sale/100)) * prise : prise} required readOnly/>
                        <Button type="submit" size={"sm"} formAction={addToBasket}>Přidat do košíku</Button>
                    </div>
                </form>
            </div>
            <div className="w-full space-y-4 sm:col-span-2 xl:col-span-1">
                <div className="w-full grid-cols-2 grid sm:grid-cols-3   gap-3">
                    {reviews && reviews.map((r: Review, i: number) => (
                        <div key={i} className="bg-primary-third rounded-lg flex flex-col text-right space-y-3 p-3">
                            
                            <div className="flex flex-row self-end space-x-2"><span>{r.rating}/5</span> <StarIcon fill="#FFEE8C" color="#FFEE8C" className="h-5 w-5 "/></div>
                            <p>&apos;{r.review}&apos;</p>
                            <i className="">{r.name}</i>
                        </div>
                    ))}
                </div>
            <div className='p-3 rounded-lg bg-secondary-foreground flex flex-col space-y-3'>
            <h1 className='text-2xl font-bold text-center'>Ohodnoťte produkt! </h1>
        <form className="w-full  grid grid-cols-1 sm:grid-cols-2  gap-6 " id='newsletter'>
            <div><label htmlFor="name">Vaše jméno</label>
            <Input className='w-full ' name="name" id="name" type="text" defaultValue={state2?.inputs?.name} placeholder="Zadejte celé jméno"  />
            {state2?.errors?.name && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state2.errors.name}
                               </p>
                            )}
            </div>
            <div><label htmlFor="rating" className="flex flex-row">Hodnoceni (1-5)<StarIcon fill="#FFEE8C" color="#FFEE8C" className="h-5 w-5 "/></label>
            <Input className='w-full ' name="rating" type="number" min={1} max={5}  defaultValue={state2?.inputs?.rating}/>
            {state2?.errors?.rating && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state2.errors.rating}
                               </p>
                            )}
            </div>
            <div><label htmlFor="review">Zpráva</label>
            <Textarea name="review" id="review" placeholder="Napište zprávu" defaultValue={state2?.inputs?.review}/>
            {state2?.errors?.review && (
                                 <p className="text-base font-semibold text-red-500">
                                 {state2.errors.review}
                               </p>
                            )}
            </div>
            <input type="hidden" name="_id" value={_id}/>
            <div className='grid grid-cols-1 justify-items-center  w-full '>
            <Button type="submit" formAction={action2} className="self-end" >{isPending2 ? <Loader2 className='animate-spin' /> : <>Odeslat</>}</Button>
            <p className='text-xs text-center'>Odesláním souhlasíte se zpracováním osobních údajů. Více informací <Link href='/souhlas' className="underline decoration-wavy decoration-secondary" target="_blank">zde</Link> </p>
            </div>
        </form> 
        </div>
            </div>
        </section>
    )
}