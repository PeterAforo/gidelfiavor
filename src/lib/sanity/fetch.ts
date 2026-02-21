import { sanityClient } from "@/lib/sanity/client";
import { hasSanityEnv } from "@/sanity/env";

export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  if (!hasSanityEnv) {
    return null;
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const result = await sanityClient.fetch<T>(query, params ?? {}, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return result;
  } catch {
    return null;
  }
}
