import { defineArrayMember, defineField, defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Strike", value: "strike-through" },
        ],
        annotations: [
          defineField({
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({ name: "href", type: "url", title: "URL" }),
              defineField({ name: "isExternal", type: "boolean", title: "External", initialValue: true }),
            ],
          }),
        ],
      },
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Number", value: "number" },
      ],
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text", validation: (r) => r.required() }),
        defineField({ name: "caption", type: "string", title: "Caption" }),
      ],
    }),
    defineArrayMember({
      type: "object",
      name: "codeBlock",
      title: "Code Block",
      fields: [
        defineField({ name: "language", type: "string", title: "Language" }),
        defineField({ name: "code", type: "text", title: "Code" }),
      ],
    }),
    defineArrayMember({
      type: "object",
      name: "callout",
      title: "Callout",
      fields: [
        defineField({ name: "tone", type: "string", title: "Tone", options: { list: ["info", "success", "warning"] } }),
        defineField({ name: "text", type: "text", title: "Text" }),
      ],
    }),
    defineArrayMember({
      type: "object",
      name: "embed",
      title: "Video Embed",
      fields: [defineField({ name: "url", type: "url", title: "YouTube/Vimeo URL" })],
    }),
  ],
});
