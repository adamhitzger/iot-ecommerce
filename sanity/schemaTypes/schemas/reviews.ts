import { StarIcon } from "@sanity/icons"
import { defineField, defineType} from "sanity"

export const review = defineType({
    type: "document",
    name: "reviews",
    title: "Hodnocení",
    icon: StarIcon,
    fields: [
        defineField({
            type: "string",
            title:"Hodnocení",
            name: "review", 
        }),
        defineField({
            type: "number",
            title:"Počet hvězd",
            name: "rating", 
        }),
        defineField({
            name: "product",
            title: "Produkt",
            type: "reference",
            to: [{type: "products"}]
        }),
        defineField({
            name: "user",
            title: "Uživatel",
            type: "reference",
            to: [{type: "users"}]
        })
    ]
})