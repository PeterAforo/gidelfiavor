import type { StructureResolver } from "sanity/structure";

const singletons = new Set(["siteSettings", "homepage", "aboutPage", "pressKit", "navigation"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem().title("Site Settings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem().title("Navigation").child(S.document().schemaType("navigation").documentId("navigation")),
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem().title("Homepage").child(S.document().schemaType("homepage").documentId("homepage")),
              S.listItem().title("About Page").child(S.document().schemaType("aboutPage").documentId("aboutPage")),
              S.documentTypeListItem("page").title("Custom Pages"),
            ]),
        ),
      S.listItem().title("Books").child(S.list().title("Books").items([S.documentTypeListItem("book").title("All Books"), S.documentTypeListItem("series").title("Series") ])),
      S.listItem().title("Blog").child(S.list().title("Blog").items([S.documentTypeListItem("blogPost").title("All Posts"), S.documentTypeListItem("category").title("Categories") ])),
      S.documentTypeListItem("event").title("Events"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.listItem().title("Press & Media").child(S.list().title("Press & Media").items([S.documentTypeListItem("pressItem").title("Press Items"), S.listItem().title("Press Kit").child(S.document().schemaType("pressKit").documentId("pressKit")) ])),
      S.documentTypeListItem("faq").title("FAQ"),
    ]);

export const singletonActions = (prev: any, context: any) => {
  if (singletons.has(context.schemaType)) {
    return prev.filter(({ action }: any) => action !== "delete" && action !== "duplicate");
  }

  return prev;
};
