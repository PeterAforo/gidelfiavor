import { aboutPage } from "@/sanity/schemas/aboutPage";
import { blogPost } from "@/sanity/schemas/blogPost";
import { blockContent } from "@/sanity/schemas/blockContent";
import { book } from "@/sanity/schemas/book";
import { category } from "@/sanity/schemas/category";
import { event } from "@/sanity/schemas/event";
import { faq } from "@/sanity/schemas/faq";
import { homepage } from "@/sanity/schemas/homepage";
import { navigation } from "@/sanity/schemas/navigation";
import { page } from "@/sanity/schemas/page";
import { pressItem } from "@/sanity/schemas/pressItem";
import { pressKit } from "@/sanity/schemas/pressKit";
import { series } from "@/sanity/schemas/series";
import { siteSettings } from "@/sanity/schemas/siteSettings";
import { testimonial } from "@/sanity/schemas/testimonial";

export const schemaTypes = [
  siteSettings,
  navigation,
  homepage,
  aboutPage,
  book,
  series,
  blogPost,
  category,
  event,
  pressItem,
  pressKit,
  testimonial,
  faq,
  page,
  blockContent,
];
