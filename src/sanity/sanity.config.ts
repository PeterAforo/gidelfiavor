import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { hasSanityEnv, sanityEnv } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemas";
import { singletonActions, structure } from "@/sanity/structure";

export default defineConfig({
  name: "default",
  title: "Gidel Fiavor",
  projectId: hasSanityEnv ? sanityEnv.projectId : "demo",
  dataset: hasSanityEnv ? sanityEnv.dataset : "production",
  basePath: "/studio",
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool()],
  document: {
    actions: singletonActions,
  },
});
