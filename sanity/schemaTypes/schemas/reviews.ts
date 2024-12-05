import { StarIcon } from "@sanity/icons"
import { defineField, defineType} from "sanity"

export const review = defineType({
    type: "document",
    name: "review",
    title: "Hodnocení",
    icon: StarIcon,
    fields: [
        defineField({
            type: "string",
            title:"Jméno",
            name: "name", 
        }),
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
        })
    ]
})