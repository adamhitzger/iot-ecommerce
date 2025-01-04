import {defineField, defineType} from 'sanity'
import { BugIcon} from "@sanity/icons"


export const contact = defineType({
    type: "document",
    name: "contact",
    title: "Kontakt",
    icon: BugIcon,
    fields: [
        defineField({
            type: "email",
            title:"Email",
            name: "email", 
        }),
        defineField({
            type: "string",
            title:"Celé méno",
            name: "fullname", 
        }),
        defineField({
            type: "string",
            title:"Telefon",
            name: "tel", 
        }),
        defineField({
            type: "string",
            title:"Firma",
            name: "ltd", 
        }),
        defineField({
            type: "string",
            title:"Zpráva",
            name: "msg", 
        }),
    ]
})