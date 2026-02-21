import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page (Singleton)",
  type: "document",
  fields: [
    defineField({ name: "heroImage", type: "image", fields: [defineField({ name: "alt", type: "string" })] }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "bio", type: "blockContent" }),
    defineField({ name: "timeline", type: "array", of: [{ type: "object", fields: [defineField({ name: "year", type: "string", validation: (r) => r.required() }), defineField({ name: "title", type: "string", validation: (r) => r.required() }), defineField({ name: "description", type: "text" })] }] }),
    defineField({ name: "achievements", type: "array", of: [{ type: "object", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "description", type: "text" }), defineField({ name: "icon", type: "string" })] }] }),
    defineField({ name: "galleryImages", type: "array", of: [{ type: "image", fields: [defineField({ name: "caption", type: "string" })] }] }),
    defineField({ name: "funFacts", type: "array", of: [{ type: "object", fields: [defineField({ name: "label", type: "string" }), defineField({ name: "value", type: "string" })] }] }),
  ],
});
