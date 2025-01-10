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
            name: "name",
            title: "Název produktu",
            type: "string",
             }),
        defineField({
            name: "quantity",
            title: "Množství",
            type: "number",
            validation: rule => rule.integer().positive().min(0)
        }),
        defineField({
            name: "price",
            title: "Cena",
            type: "number",
            }),
        defineField({
            name: "variant",
            title: "Varianta",
            type: "string",
              }),
        defineField({
            name: "terpens",
            title: "Příchuť",
            type: "string",
          }),
    ]})