import {defineField, defineType} from 'sanity'
import { BugIcon} from "@sanity/icons"


export const contact = defineType({
    type: "document",
    name: "contact",
    title: "Kontakt",
    icon: BugIcon,
    fields: [
        defineField({
            type: "reference",
            name: "user",
            title: "Uživatel",
            to: [{type: "users"}]
        }),
        defineField({
            type: "string",
            title:"Zpráva",
            name: "msg", 
        }),
    ]
})