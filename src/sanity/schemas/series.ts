import { defineField, defineType } from "sanity";

export const series = defineType({
  name: "series",
  title: "Series",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "description", type: "blockContent" }),
    defineField({ name: "coverImage", type: "image" }),
    defineField({ name: "books", type: "array", of: [{ type: "reference", to: [{ type: "book" }] }] }),
  ],
});
