import { groq } from "next-sanity";

export const fetchSiteSettings = groq`*[_type == "siteSettings"][0]`;
export const fetchNavigation = groq`*[_type == "navigation"][0]`;
export const fetchHomepage = groq`*[_type == "homepage"][0]{..., featuredBook->, featuredBooks[]->}`;
export const fetchLatestPosts = groq`*[_type == "blogPost"] | order(publishedAt desc)[0...3]{..., categories[]->}`;
export const fetchUpcomingEvents = groq`*[_type == "event" && date >= now()] | order(date asc)[0...3]{..., relatedBook->}`;
export const fetchAboutPage = groq`*[_type == "aboutPage"][0]`;
export const fetchAllBooks = groq`*[_type == "book"] | order(publishDate desc){..., series->}`;
export const fetchBookBySlug = groq`*[_type == "book" && slug.current == $slug][0]{..., series->, relatedBooks[]->}`;
export const fetchAllSeries = groq`*[_type == "series"]{..., books[]->}`;
export const fetchAllPosts = groq`*[_type == "blogPost"] | order(publishedAt desc){..., categories[]->}`;
export const fetchPostBySlug = groq`*[_type == "blogPost" && slug.current == $slug][0]{..., categories[]->}`;
export const fetchCategories = groq`*[_type == "category"] | order(title asc)`;
export const fetchRelatedPosts = groq`*[_type == "blogPost" && slug.current != $currentSlug && count(categories[@._ref in $categoryIds]) > 0][0...3]{..., categories[]->}`;
export const fetchPastEvents = groq`*[_type == "event" && date < now()] | order(date desc){..., relatedBook->}`;
export const fetchPressKit = groq`*[_type == "pressKit"][0]{..., bookCovers[]{..., book->}}`;
export const fetchPressItems = groq`*[_type == "pressItem"] | order(date desc)`;
