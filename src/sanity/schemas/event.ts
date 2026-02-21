import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "eventType", type: "string" }),
    defineField({ name: "date", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "endDate", type: "datetime" }),
    defineField({ name: "location", type: "object", fields: [defineField({ name: "venue", type: "string" }), defineField({ name: "address", type: "string" }), defineField({ name: "city", type: "string" }), defineField({ name: "state", type: "string" }), defineField({ name: "country", type: "string" }), defineField({ name: "isVirtual", type: "boolean" }), defineField({ name: "virtualLink", type: "url" })] }),
    defineField({ name: "description", type: "blockContent" }),
    defineField({ name: "image", type: "image" }),
    defineField({ name: "registrationLink", type: "url" }),
    defineField({ name: "isFree", type: "boolean" }),
    defineField({ name: "price", type: "string" }),
    defineField({ name: "relatedBook", type: "reference", to: [{ type: "book" }] }),
    defineField({ name: "status", type: "string", options: { list: ["Upcoming", "Sold Out", "Cancelled", "Completed"] } }),
  ],
});
