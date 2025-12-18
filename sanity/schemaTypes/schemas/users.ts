import { UserIcon } from "@sanity/icons"
import { defineType, defineField } from "sanity"

export const userType = defineType({
    name: "users",
        title: "Uživatelé",
        type: "document",
        icon: UserIcon,
        fields: [
            defineField({
                type: "string",
                title:"Email účtu",
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
            }),
            defineField({
                type: "string",
                title:"Telefon",
                name: "tel", 
            }),
             defineField({
                type: "string",
                title:"Typ obchodu",
                name: "type", 
                options: {
                list: [
                    {title: "B2C", value: "customer"},
                    {title: "B2B", value: "bussiness"},
                    ],
                layout: "radio"
            }
            }),
            defineField({
                title: "IČO",
                name: "ico",
                type: "number"
            }),
            defineField({
                type: "string",
                title:"Získání zákazníka",
                name: "event_type", 
                options: {
                list: [
                    {title: "Newsletter", value: "newsletter"},
                    {title: "Recenze", value: "reviews"},
                    {title: "Objednávka", value: "order"},
                    {title: "Kontakt", value:"contact"},
                    {title: "Registrace", value:"signUp"},
                    ],
                layout: "dropdown"
            }
            }),
            defineField({
                title: "Souhlas se zasíláním kampaní",
                name: "souhlas",
                type: "boolean"
            }),
            defineField({
            type: "string",
            title:"Země",
            name: "country", 
            initialValue: "Česká republika",
            options: {
                list: ["Slovenská republika","Česká republika"],
                layout: "dropdown",
            }
        }),
        defineField({
            type: "string",
            title:"Kraj",
            name: "region", 
        }),
        defineField({
            type: "string",
            title: "PSČ",
            name: "postalCode", 
        }),
        defineField({
            type: "string",
            title:"Adresa",
            name: "address", 
        }),
        defineField({
            type: "string",
            title:"Město",
            name: "city", 
        }),
        ]

})