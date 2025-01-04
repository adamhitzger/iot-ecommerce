"use client";

import { components } from "@/sanity/lib/components";
import { Product, Review, Reviews } from "@/types";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ChangeEvent } from "react";
import { Loader2, StarIcon } from "lucide-react";
import { useCart } from "@/lib/card";
import { createBasket, saveReview } from "@/actions/actions";
import { Textarea } from "./ui/textarea";
import toast from "react-hot-toast";

export default function ProductComponent({product, reviews}: {product: Product, reviews: Reviews}){
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
        variants
    } = product;
    const allPictures = [picture, ...pictures]
    const [isPending, startTransition] = useTransition();
    const [curImg, setCurImg] = useState<number>(0);
    const [price, setPrice] = useState<number>(variants[0]?.price_b2c || 0);

    async function handleCreate(formData: FormData) {
        startTransition(async () => {
          const data = await createBasket(formData);
          addItem({
            id: data._id,
            name: data.name,
            price: data.price,
            variant: data.variant,
            terpens: data.terpen,
            quantity: data.quantity,
          })
        })
      }

      async function handleSaveReview(formData: FormData) {
        startTransition(async () => {
            await saveReview(formData)
            toast.success("Vaše hodnocení bylo odesláno, děkujeme za zpětnou vazbu!");
            setReview({
                _id: _id,
        name: "",
        rating: 1,
        review: "",
            })
        })
      }
    const [form, setForm] = useState({
        _id: _id,
        name: name,
        terpens: terpens[0]?.slug || undefined,
        variant: variants[0]?.slug || undefined,
        quantity: 1,
      }); 
      const [review, setReview] = useState({
        _id: _id,
        name: "",
        rating: 1,
        review: "",
      }); 
      const handleTerpensChange = (terpen: string) => {
        setForm(prevForm => ({ ...prevForm, terpen }));
        console.log(terpen);  // Logs the selected value
      };
    
      const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
        const quantity = parseInt(event.target.value, 10);
        setForm(prevForm => ({ ...prevForm, quantity }));

      }
    

      const handleVariantsChange = (variant: string) => {
        const selectedVariant = variants.find((v) => v.slug === variant);
        if (selectedVariant) {
            setForm((prevForm) => ({ ...prevForm, variant: selectedVariant.v_name }));
            if(user){setPrice(selectedVariant.price_b2c)} else { setPrice(selectedVariant.price_b2b)} 
            console.log(selectedVariant.v_name)
    }
      }

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setReview({ ...review, [name]: value })
    };
    return(
        <section className="grid grid-cols-3 gap-8">
            <div className="w-full flex flex-col space-y-2">
            <div className="w-full relative aspect-square ">
                <Image src={allPictures[curImg]} alt={`${name} - ${overview}`} fill={true} className="rounded-lg object-cover"/>
                </div>
                
                <div className=" flex flex-row  fex-wrap gap-2">
                    {allPictures.map((p: string, i: number) => (
                        <div key={i} className="w-32 h-32 relative ">                        
                            <Image src={p} alt={name}  onClick={()  => setCurImg(i)}  fill={true} className={`rounded-lg object-cover ${i === curImg ? "border-secondary border-2" : null}`}/>  
                            </div>                
                    ))}
                </div>
            </div>
            <div className="w-full flex flex-col text-lg text-right space-y-4 items-end">
                <h1 className="text-6xl font-bold">{name}</h1>
                <Link href={`/products/?name=${category.slug}`} className="underline underline-offset-2 text-2xl">{category.name}</Link>
                <div className="flex flex-row text-3xl font-medium space-x-3">
                    <span className={`${sale ? "text-red-600 line-through font-bold" : null}`}>{price} Kč</span> {sale ? <span>{(1-(sale/100)) * price } Kč</span> : null}
                </div>
                <PortableText components={components} value={details}/>
                
                 
                <form className="flex flex-col justify-end">
                    <div className="flex-col items-end ">
                        <label htmlFor="terpens">Příchutě:</label>
                        <RadioGroup name="terpen" id="terpens" defaultValue={form.terpens} onValueChange={handleTerpensChange} disabled={isPending} className="flex flex-row space-x-4 flex-wrap">
                
                            {terpens.map((t, i) => (
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
                        defaultValue={form.terpens} 
                        onValueChange={handleVariantsChange} 
                        disabled={isPending}>
                            {variants.map((v, i) => (
                                <div key={i} className="flex flex-row space-x-2">
                                <label htmlFor={v.slug}>{v.v_name}</label>
                                <RadioGroupItem value={v.slug} className="border-white"/>
                                
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                    <div className="flex flex-row justify-end items-end w-full  space-x-4">
                        <Input name="quantity" type="number" value={form.quantity} min={"1"} disabled={isPending} onChange={handleQuantityChange} className="w-12"/>
                        <input type="hidden" name="_id" defaultValue={form._id} required/>
                        <input type="hidden" name="name" defaultValue={form.name} required/>
                        <input type="hidden" name="price" defaultValue={sale ? (1-(sale/100)) * price : price} required/>
                        <Button type="submit" size={"sm"} formAction={handleCreate}>{isPending ? <Loader2 className='animate-spin' /> : <>Přidat do košíku</>}</Button>
                    </div>
                </form>
            </div>
            <div className="w-full space-y-4">
                <div className="w-full grid grid-cols-2 gap-3">
                    {reviews.map((r: Review, i: number) => (
                        <div key={i} className="bg-primary-third rounded-lg flex flex-col text-right space-y-3 p-3">
                            
                            <div className="flex flex-row self-end space-x-2"><span>{r.rating}/5</span> <StarIcon className="h-5 w-5 "/></div>
                            <p>&apos;{r.review}&apos;</p>
                            <i className="">{r.name}</i>
                        </div>
                    ))}
                </div>
            <div className='p-3 rounded-lg bg-secondary-foreground flex flex-col space-y-3'>
            <h1 className='text-2xl font-bold text-center'>Ohodnoťte produkt! </h1>
        <form className="w-full  grid grid-cols-2  gap-6 " id='newsletter'>
            <div><label htmlFor="name">Vaše jméno</label>
            <Input className='w-full ' name="name" id="name" type="text" placeholder="Zadejte celé jméno" defaultValue={review.name} onChange={handleChange} required /></div>
            <div><label htmlFor="rating">Hodnoceni (1-5)</label>
            <Input className='w-full ' name="rating" type="number" min={1} max={5}  value={review.rating} onChange={handleChange} required /></div>
            <div><label htmlFor="review">Zpráva</label>
            <Textarea name="review" id="review" placeholder="Napište zprávu"/></div>
            <input type="hidden" name="_id" value={review._id}/>
            <Button type="submit" formAction={handleSaveReview} className="self-end" >{isPending ? <Loader2 className='animate-spin' /> : <>Odeslat</>}</Button>
        </form>
        <p className='text-sm text-center'>Přihlášením k odběru souhlasíte se zpracováním osobních údajů. Více informací <Link href='/souhlast' className="underline" target="_blank">zde</Link> </p>
        </div>
            </div>
        </section>
    )
}