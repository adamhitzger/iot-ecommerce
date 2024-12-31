import { PackageIcon } from "@sanity/icons"
import { defineArrayMember, defineField, defineType} from "sanity"

export const orders = defineType({
    type: "document",
    name: "orders",
    title: "Objednávky",
    icon: PackageIcon,
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
        }),
        defineField({
            type: "string",
            title:"Telefonní číslo",
            name: "phone", 
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
            type: "number",
            title: "PSČ",
            name: "postalCode", 
            validation: rule => rule.positive().integer().min(0),
        }),
        defineField({
            type: "string",
            title:"Adresa",
            name: "address", 
        }),
        defineField({
            type: "number",
            title:"Celková cena",
            name: "total",
            validation: rule => rule.positive().integer().min(0), 
        }),
        defineField({
            type: "number",
            title:"ID Zásilkovny",
            name: "packetaId", 
            validation: rule => rule.positive().integer().min(0),
        }),
        defineField({
            type: "string",
            title:"Štítek ze Zásilkovny",
            name: "barcode", 
        }),
        defineField({
            type: "string",
            title:"Status",
            name: "status", 
            options: {
                list: ["Přijatá", "Zaplacená" ,"Odeslaná", "Vyzvednutá", "Zrušená", "Vrácení"],
                layout: "dropdown",
            }
        }),
        defineField({
            type: "array",
            title: "Objednaný produkty",
            name: "orderedProducts",
            of: [
                defineArrayMember({
                    name: "orderedItem",
                    type: "orderedItem"
                })
            ]
        }),
    ]
})