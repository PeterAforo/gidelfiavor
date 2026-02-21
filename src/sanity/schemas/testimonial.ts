import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", type: "text", validation: (r) => r.required() }),
    defineField({ name: "author", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "source", type: "string" }),
    defineField({ name: "rating", type: "number", validation: (r) => r.min(1).max(5) }),
    defineField({ name: "relatedBook", type: "reference", to: [{ type: "book" }] }),
    defineField({ name: "isFeatured", type: "boolean" }),
  ],
});
