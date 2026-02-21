import { defineField, defineType } from "sanity";

export const pressKit = defineType({
  name: "pressKit",
  title: "Press Kit (Singleton)",
  type: "document",
  fields: [
    defineField({
      name: "authorBio",
      type: "object",
      fields: [
        defineField({ name: "short", type: "text" }),
        defineField({ name: "medium", type: "text" }),
        defineField({ name: "full", type: "blockContent" }),
      ],
    }),
    defineField({
      name: "authorPhotos",
      type: "array",
      of: [
        {
          type: "image",
          fields: [
            defineField({ name: "alt", type: "string" }),
            defineField({ name: "highRes", type: "file" }),
          ],
        },
      ],
    }),
    defineField({
      name: "bookCovers",
      type: "array",
      of: [{ type: "object", fields: [defineField({ name: "book", type: "reference", to: [{ type: "book" }] }), defineField({ name: "highResImage", type: "image" })] }],
    }),
    defineField({ name: "factSheet", type: "file", options: { accept: ".pdf" } }),
    defineField({ name: "brandGuidelines", type: "file", options: { accept: ".pdf" } }),
    defineField({
      name: "contactForPress",
      type: "object",
      fields: [
        defineField({ name: "name", type: "string" }),
        defineField({ name: "email", type: "string" }),
        defineField({ name: "phone", type: "string" }),
      ],
    }),
  ],
});
