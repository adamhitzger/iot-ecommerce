"server-only"

import { z} from "zod"

const phoneRegex = new RegExp(/^[0-9]{9}$/)

export const userUpdateSchema = z.object({
    email: z.string().min(1, {message: "Pole je povinné"}).email("Zadali jste email ve špatném formátu"),
    last_name: z.string().min(1,{message: "Pole je povinné"}),
    first_name: z.string().min(1, "Pole je povinné"),
    ico: z.number().optional()
})

export const passSchema = z.object({
    password: z.string().min(8, "Heslo musí obsahovat nejméně 8 znaků"),
})


export const signSchema = z.object({
    email: z.string().min(1, {message: "Pole je povinné"}).email("Zadali jste email ve špatném formátu"),
    password: z.string().min(8, "Heslo musí obsahovat nejméně 8 znaků"),
})

export const userSchema = z.object({
    email: z.string().min(1, {message: "Pole je povinné"}).email("Zadali jste email ve špatném formátu"),
    last_name: z.string().min(1,{message: "Pole je povinné"}),
    first_name: z.string().min(1, "Pole je povinné"),
    password: z.string().min(8, "Heslo musí obsahovat nejméně 8 znaků"),
    ico: z.number().optional()
})

export const orderedSchema = z.object({
    _type: z.string(),
    email: z.string().min(1, {message: "Pole je povinné"}).email("Zadali jste email ve špatném formátu"),
    phone: z.string().min(1,{message: "Pole je povinné"}).regex(phoneRegex, {message: "Zadali jste číslo ve špatném formátu"}),
    name: z.string().min(1, "Pole je povinné"),
    surname: z.string().min(1, "Pole je povinné"),
    address: z.string().min(1, "Pole je povinné"),
    city: z.string().min(1, "Pole je povinné"),
    region: z.string().min(1, "Pole je povinné"),
    country: z.string(),
    postalCode: z.string().min(5, "Pole musí obsahovat 5 znaků").max(5, "\nPole musí obsahovat 5 znaků"),
    cod: z.string().min(1, "Vyberte jednu z možností"),
    packetaId: z.number().min(1, "Vyberte Zásilkovnu"),
    total: z.number().min(1, "Pole je povinné"),
    status: z.string(),
    date: z.string(),
    couponValue: z.number().optional()
})

export const contactSchema = z.object({
    _type: z.string(),
    email: z.string().min(1, {message: "Pole je povinné"}).email("Zadali jste email ve špatném formátu"),
    tel: z.string().min(1,{message: "Pole je povinné"}).regex(phoneRegex, {message: "Zadali jste číslo ve špatném formátu"}),
    name: z.string().min(1, "Pole je povinné"),
    msg: z.string().min(1, "Pole je povinné"),
    ltd: z.string().optional()
})

export const newsletterSchema = z.object({
    _type: z.string(),
    email: z.string().min(1, {message: "Pole je povinné"}).email("\nZadali jste email ve špatném formátu"),
    name: z.string().min(1, "Pole je povinné"),
    surname: z.string().min(1, "Pole je povinné"),
})

export const reviewSchema = z.object({
    _type: z.string(),
    name: z.string().min(1, "Pole je povinné"),
    review: z.string().min(1, "Pole je povinné"),
    rating: z.number().min(1, "Pole je povinné").max(5, "Pole je povinné"),
    product: z.object({
        _type: z.string(),
        _ref: z.string()
    })
})

export const basketSchema = z.object({
    name:  z.string().min(1, "Pole je povinné"),
     _id: z.string().min(1, "Pole je povinné"),
     price:  z.number().min(1, "Pole je povinné"),
     terpen:  z.string().min(1, "Pole je povinné"),
     quantity:  z.number().min(1, "Pole je povinné"),
     variant: z.string().min(1, "Pole je povinné"),
})