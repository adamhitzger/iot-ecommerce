import { PlugIcon } from "@sanity/icons"
import { defineField, defineType, defineArrayMember} from "sanity"

export const product = defineType({
    type: "document",
    name: "products",
    title: "Produkty",
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
        defineField({name: "sale", title: "Sleva v procentech", type: "number"}),
        defineField({
            type: "array",
            title:"SEO klíčová slova",
            name: "keywords", 
            of: [
                defineArrayMember({
                    type: "string"
                })
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
            type: "array",
            title:"Popis",
            name: "details",
            of: [
                defineArrayMember({
                     type: "block"
                    })
            ] 
        }),
        defineField({
            name: "image",
            title: "Hlavní fotka",
            type: "image",
        }),
        defineField({
            name: "images",
            title: "Galerie fotek",
            type: "array",
            of: [
                defineArrayMember({
                    type: "image"
                }),
            ]
        }),
        defineField({
            type: "array",
            title: "Příchutě",
            name: "terpens",
            of: [
                defineArrayMember({
                    type: "object",
                        title: "Příchuť",
                        name: "terpen",
                        fields: [
                           defineField({name: "t_name", title: "Název příchutě", type: "string"}),
                           defineField({name: "value", title: "Hodnota", type: "slug", options: {source: (doc, context) => {
                            const parent = context.parent as { t_name?: string };
                            return parent?.t_name || "";
                          }}}),
                            defineField({name: "color", title: "Barva příchutě", type: "color"}),  
                        ]
                })
            ]
        }),
        defineField({
            type: "array",
            title: "Varianty",
            name: "variants",
            of: [
                defineArrayMember({
                    type: "object",
                    title: "Varianta",
                    name: "var",
                    fields: [
                        defineField({name: "v_name", title: "Název varianty", type: "string"}),
                            defineField({name: "value", title: "Hodnota", type: "slug", options: {source: (doc, context) => {
                            const parent = context.parent as { v_name?: string };
                            return parent?.v_name || "";
                          }}}),
                          defineField({name: "price_b2c", title: "Cena pro zákazníky", type: "number", validation: rule => rule.required().integer().positive()}),
                          defineField({name: "price_b2b", title: "Velkoobchodní cena", type: "number", validation: rule => rule.required().integer().positive()}),
                          ]
                })
            ]
        }),
        defineField({
            type: "number",
            title: "Množství",
            name: "quantity",
            validation: rule => rule.required().integer().positive().min(0)
        }),
        defineField({
            name: "category",
            title: "Kategorie",
            type: "reference",
            to: [{type: "categories"}]
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
                defineArrayMember({
                    type: "url"
                })
            ]
        })
    ]
})