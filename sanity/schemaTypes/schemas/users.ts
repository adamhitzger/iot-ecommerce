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
        ]

})