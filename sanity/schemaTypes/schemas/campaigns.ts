import { defineField, defineType } from "sanity";

export const campaign = defineType({
    name: "campaigns",
    title: "SMS/Email kampaně",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title:"Název kampaně",
            type: "string"
        }),
        defineField({
            name: "slug",
            title:"Název kampaně pro utm",
            type: "slug",
            options: {
                source: "name"
            }
        }),
        defineField({
            type: "reference",
            name: "campaignCode",
            title: "Slevový kód kampaně",
            to: [{type: "coupons"}]
        }),
        defineField({
            type: "string",
            name: "targetSegment",
            title: "Zákaznický cíl",
            options: {
                list: [
                    {title: "Newsletter", value: "newsletter"},
                    {title: "Objednávky", value: "order"},
                    {title: "Dle koupené kategorie", value: "byCategory"},
                    {title: "Dle koupeného produktu", value: "byProduct"},
                ],
                layout: "dropdown"
            }
        }),
         defineField({
            type: "string",
            name: "targetEra",
            title: "Zákazníci podle doby od poslední objednávky",
            options: {
                list: [
                    {title: "méně než 30 dní", value: "month"},
                    {title: "méně než 90 dní", value: "quarter"},
                    {title: "méně než 120 dní", value: "half-yearly"},
                    {title: "méně než 365 dní", value: "year"},
                    {title: "více než 365 dní", value: "overYear"},
                 ],
                layout: "dropdown"
            }
        }),
        defineField({
            type: "string",
            name: "targetSegmentType",
            title: "Typ zákazníků",
            options: {
                list: [
                    {title: "Jednorázoví", value: "one"},
                    {title: "Opakující se", value: "more"},
                    ],
                layout: "radio"
            }
        }),
           defineField({ name: 'emailSubject', type: 'string', title: 'Email Subject' }),
    defineField({ name: 'emailHeading', type: 'string', title: 'Email Heading' }),
    defineField({
      name: 'emailBody',
      type: 'array',
      title: 'Email Body',
      of: [{ type: 'block' }]
    }),

    defineField({
      name: 'emailProducts',
      type: 'array',
      title: 'Products in Email',
      of: [{ type: 'reference', to: [{ type: 'products' }] }]
    }),
    defineField({ name: 'smsText', type: 'string', title: 'SMS text' }),
    defineField({
      name: 'utmTerm',
      type: 'string',
      title: 'UTM Term',
    }),
defineField({
      name: 'utmContent',
      type: 'string',
      title: 'UTM Content',
    }),
    ]
})