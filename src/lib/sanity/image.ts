import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { sanityClient } from "@/lib/sanity/client";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: Image | { asset?: { _ref?: string } } | undefined) {
  return builder.image(source || { asset: { _ref: "" } });
}
