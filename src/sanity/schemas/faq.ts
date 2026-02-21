import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "blockContent" }),
    defineField({ name: "category", type: "string", options: { list: ["General", "Books", "Events", "Press", "Other"] } }),
    defineField({ name: "order", type: "number" }),
  ],
});
