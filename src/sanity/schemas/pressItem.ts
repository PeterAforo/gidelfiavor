import { defineField, defineType } from "sanity";

export const pressItem = defineType({
  name: "pressItem",
  title: "Press Item",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "type", type: "string" }),
    defineField({ name: "publication", type: "string" }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "embedUrl", type: "url" }),
    defineField({ name: "excerpt", type: "text" }),
    defineField({ name: "image", type: "image" }),
    defineField({ name: "isFeatured", type: "boolean" }),
  ],
});
