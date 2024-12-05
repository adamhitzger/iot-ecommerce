import {defineField, defineType} from 'sanity'

export const orderedItem = defineType({
    name: "orderedItem",
    title: "Objednaný prdukt",
    type: "object",
    fields: [
        defineField({
            name: "productId",
            title: "Produkt",
            type: "reference",
            to: [{type: "products"}]
        }),
        defineField({
            name: "quantity",
            title: "Množství",
            type: "number",
            validation: rule => rule.integer().positive().min(0)
        }),
    ]})