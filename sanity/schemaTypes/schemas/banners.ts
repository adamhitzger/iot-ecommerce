import { defineType, defineField } from "sanity"
import { ImageIcon } from "@sanity/icons"
export const banner = defineType({
    name: "banners",
    title: "Bannery",
    type: "document",
    icon: ImageIcon,
    fields: [
        defineField({
            type: "string",
            title:"Nadpis",
            name: "heading", 
        }),
        defineField({
            type: "image",
            title:"Obrázek",
            name: "image", 
        }),
        defineField({
            type: "string",
            name: "text",
            title: "Text"
        }),
        defineField({
            name: "category",
            title: "Kategorie",
            type: "reference",
            to: [{type: "categories"}]
        }),
    ]
})