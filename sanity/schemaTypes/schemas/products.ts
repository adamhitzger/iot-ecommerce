import { PlugIcon } from "@sanity/icons"
import { defineField, defineType} from "sanity"

export const product = defineType({
    type: "document",
    name: "product",
    title: "Produkt",
    icon: PlugIcon,
    fields: [
        defineField({
            type: "string",
            title:"Název",
            name: "name", 
        }),
        defineField({
            type: "string",
            title:"Náhledový text",
            name: "overview", 
        }),
        defineField({
            type: "slug",
            title: "URL adresa",
            name: "slug",
            options: {
                source: "name"
            }
        }),
        defineField({
            type: "number",
            title:"Cena",
            name: "price", 
            validation: rule => rule.required().integer().positive()
        }),
        defineField({
            type: "array",
            title:"Popis",
            name: "details",
            of: [
                { type: "block"}
            ] 
        }),
        defineField({
            name: "image",
            title: "Hlavní fotka",
            type: "image",
        }),
        defineField({
            name: "gallery",
            title: "Galerie fotek",
            type: "array",
            of: [
                {type: "image"},
            ]
        }),
        defineField({
            type: "number",
            title: "Množství",
            name: "quantity",
            validation: rule => rule.required().integer().positive()
        }),
        defineField({
            name: "category",
            title: "Kategorie",
            type: "reference",
            to: [{type: "category"}]
        }),
        defineField({
            name: "manual",
            title: "Manuál ke stažení",
            type: "file"
        }),
        defineField({
            name: "tutorial",
            title: "URL tutoriálu",
            type: "array",
            of: [
                {type: "url"}
            ]
        })
    ]
})