import { defineField, defineType } from "sanity";

const linkFields = [
  defineField({ name: "label", type: "string", validation: (r) => r.required() }),
  defineField({ name: "href", type: "string", validation: (r) => r.required() }),
  defineField({ name: "isExternal", type: "boolean", initialValue: false }),
];

export const navigation = defineType({
  name: "navigation",
  title: "Navigation (Singleton)",
  type: "document",
  fields: [
    defineField({
      name: "mainNav",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            ...linkFields,
            defineField({
              name: "children",
              type: "array",
              of: [{ type: "object", fields: linkFields }],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "footerNav",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "groupTitle", type: "string" }),
            defineField({
              name: "links",
              type: "array",
              of: [{ type: "object", fields: linkFields }],
            }),
          ],
        },
      ],
    }),
  ],
});
