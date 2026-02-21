import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage (Singleton)",
  type: "document",
  fields: [
    defineField({
      name: "heroSection",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "subheading", type: "string" }),
        defineField({ name: "description", type: "text" }),
        defineField({ name: "authorImage", type: "image", options: { hotspot: true } }),
        defineField({ name: "backgroundImage", type: "image" }),
        defineField({ name: "ctaButton", type: "object", fields: [defineField({ name: "text", type: "string" }), defineField({ name: "link", type: "string" })] }),
        defineField({ name: "secondaryButton", type: "object", fields: [defineField({ name: "text", type: "string" }), defineField({ name: "link", type: "string" })] }),
      ],
    }),
    defineField({ name: "featuredBook", type: "reference", to: [{ type: "book" }] }),
    defineField({ name: "featuredBooks", type: "array", of: [{ type: "reference", to: [{ type: "book" }] }], validation: (r) => r.max(4) }),
    defineField({ name: "aboutPreview", type: "object", fields: [defineField({ name: "heading", type: "string" }), defineField({ name: "text", type: "blockContent" }), defineField({ name: "image", type: "image" }), defineField({ name: "ctaText", type: "string" })] }),
    defineField({ name: "testimonials", type: "array", of: [{ type: "object", fields: [defineField({ name: "quote", type: "text" }), defineField({ name: "author", type: "string" }), defineField({ name: "source", type: "string" }), defineField({ name: "rating", type: "number", validation: (r) => r.min(1).max(5) })] }] }),
    defineField({ name: "newsletterSection", type: "object", fields: [defineField({ name: "heading", type: "string" }), defineField({ name: "description", type: "text" }), defineField({ name: "incentive", type: "string" })] }),
  ],
});
