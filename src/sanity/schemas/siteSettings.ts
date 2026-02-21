import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings (Singleton)",
  type: "document",
  fields: [
    defineField({ name: "siteTitle", type: "string", validation: (r) => r.required() }),
    defineField({ name: "siteDescription", type: "text" }),
    defineField({ name: "siteLogo", type: "image", fields: [defineField({ name: "alt", type: "string" })] }),
    defineField({ name: "ogImage", type: "image" }),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [{ type: "object", fields: [defineField({ name: "platform", type: "string" }), defineField({ name: "url", type: "url", validation: (r) => r.required() })] }],
    }),
    defineField({ name: "footerText", type: "string" }),
    defineField({
      name: "announcement",
      type: "object",
      fields: [
        defineField({ name: "enabled", type: "boolean" }),
        defineField({ name: "message", type: "string" }),
        defineField({ name: "link", type: "url" }),
        defineField({ name: "linkText", type: "string" }),
      ],
    }),
  ],
});
