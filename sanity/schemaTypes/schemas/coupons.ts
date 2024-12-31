import { defineType, defineField } from "sanity"
import { BlockContentIcon } from "@sanity/icons"
export const coupon = defineType({
    name: "coupons",
    title: "Kupony",
    type: "document",
    icon: BlockContentIcon,
    fields: [
        defineField({
            type: "string",
            title:"Kód kupónu",
            name: "code", 
        }),
        defineField({
            type: "number",
            title:"Sleva v procentech",
            name: "percentage", 
        }),
        defineField({
            type: "boolean",
            name: "free_del",
            title: "Poštovné zadarmo"
        }),
    ]
})