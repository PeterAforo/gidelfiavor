import { defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Custom Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "body", type: "blockContent" }),
    defineField({
      name: "seo",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", type: "string" }),
        defineField({ name: "metaDescription", type: "text" }),
        defineField({ name: "ogImage", type: "image" }),
      ],
    }),
  ],
});
