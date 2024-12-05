import {defineField, defineType} from 'sanity'
import { BookIcon} from "@sanity/icons"

export const newsletter = defineType({
    type: "document",
    name: "newsletter",
    title: "Newsletter",
    icon: BookIcon,
    fields: [
        defineField({
            type: "email",
            title:"Email",
            name: "email", 
        }),
        defineField({
            type: "string",
            title:"Jméno",
            name: "name", 
        }),
        defineField({
            type: "string",
            title:"Přijmení",
            name: "surname", 
        })
    ]
})