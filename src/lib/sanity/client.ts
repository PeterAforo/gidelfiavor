import { createClient } from "next-sanity";
import { hasSanityEnv, sanityEnv } from "@/sanity/env";

const fallbackClient = createClient({
  projectId: "demo",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
  perspective: "published",
});

export const sanityClient = hasSanityEnv
  ? createClient({
      projectId: sanityEnv.projectId,
      dataset: sanityEnv.dataset,
      apiVersion: sanityEnv.apiVersion,
      useCdn: process.env.NODE_ENV === "production",
      perspective: "published",
      stega: {
        studioUrl: "/studio",
      },
    })
  : fallbackClient;

export const sanityWriteClient = hasSanityEnv
  ? createClient({
      projectId: sanityEnv.projectId,
      dataset: sanityEnv.dataset,
      apiVersion: sanityEnv.apiVersion,
      token: sanityEnv.token,
      useCdn: false,
      perspective: "published",
    })
  : fallbackClient;
