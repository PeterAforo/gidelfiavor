import { defineField, defineType } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "author", type: "string", initialValue: "Gidel Fiavor" }),
    defineField({ name: "publishedAt", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "updatedAt", type: "datetime" }),
    defineField({ name: "featuredImage", type: "image", fields: [defineField({ name: "alt", type: "string" })] }),
    defineField({ name: "excerpt", type: "text", validation: (r) => r.max(300) }),
    defineField({ name: "body", type: "blockContent" }),
    defineField({ name: "categories", type: "array", of: [{ type: "reference", to: [{ type: "category" }] }] }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "readingTime", type: "number" }),
    defineField({ name: "isFeatured", type: "boolean" }),
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
