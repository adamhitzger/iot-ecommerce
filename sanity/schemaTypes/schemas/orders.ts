import { PackageIcon } from "@sanity/icons"
import { defineArrayMember, defineField, defineType} from "sanity"

export const orders = defineType({
    type: "document",
    name: "orders",
    title: "Objednávky",
    icon: PackageIcon,
    fields: [
        defineField({
            type: "reference",
            title:"Uživatel",
            name: "user",
            to: [{type: "users"}] 
        }),
        defineField({
            type: "string",
            title:"Datum vytvoření",
            name: "date", 
        }),
        defineField({
            name: "cod",
            title: "Dobírka",
            type: "string",
        }),
        defineField({
            type: "number",
            title:"Celková cena",
            name: "total",
            validation: rule => rule.positive().integer().min(0), 
        }),
        defineField({
            type: "number",
            title:"Hodnota kuponu",
            name: "couponValue",
            validation: rule => rule.positive().integer().min(0), 
        }),
        defineField({
            type: "boolean",
            title:"Hodnota kuponu",
            name: "free_del",
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
        defineField({
            type: "file",
            title:"Faktura",
            name: "invoice", 
        }),
    ]
})