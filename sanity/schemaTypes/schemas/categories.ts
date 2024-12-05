import { defineField, defineType} from "sanity"
import { TagsIcon } from "@sanity/icons"
export const category = defineType({
    type: "document",
    name: "category",
    title: "Kategorie",
    icon: TagsIcon,
    fields: [
        defineField({
            type: "string",
            title:"Název",
            name: "name", 
        }),
        defineField({
            type: "array",
            title:"Informační text",
            name: "overview", 
            of: [
                {type: "block"}
            ]
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
            type: "image",
            title:"Náhledový obrázek",
            name: "image", 
        }),
    ]
})