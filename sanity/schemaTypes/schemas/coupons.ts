import { defineType, defineField } from "sanity"
import { StarIcon } from "@sanity/icons"
export const coupon = defineType({
    name: "coupons",
    title: "Kupony",
    type: "document",
    icon: StarIcon,
    fields: [
        defineField({
            type: "string",
            title:"Kód kupónu",
            name: "code", 
        }),
        defineField({
            type: "number",
            title:"Hodnota slevy",
            name: "value", 
        }),
        defineField({
            type: "boolean",
            name: "free_del",
            title: "Poštovné zadarmo"
        }),
    ]
})