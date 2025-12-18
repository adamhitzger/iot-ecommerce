import { defineField, defineType } from "sanity";

export const verifyCodes = defineType({
    type: "document",
    name: "verifyCodes",
    title: "Ověřovací kódy(neupravovat)",
    fields: [
        defineField({
            type: "string",
            name: "code",
        }),
         defineField({
            type: "string",
            name: "email",
        })
    ]
})