const requiredPublicVars = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
};

const projectIdPattern = /^[a-z0-9-]+$/;

function isValidProjectId(value?: string) {
  return Boolean(value && projectIdPattern.test(value));
}

export const sanityEnv = {
  projectId: requiredPublicVars.projectId ?? "",
  dataset: requiredPublicVars.dataset ?? "production",
  apiVersion: requiredPublicVars.apiVersion ?? "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
};

export const hasSanityEnv =
  isValidProjectId(sanityEnv.projectId) && Boolean(sanityEnv.dataset) && Boolean(sanityEnv.apiVersion);

export function assertSanityEnv() {
  if (!hasSanityEnv) {
    throw new Error(
      "Missing Sanity environment variables. Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and NEXT_PUBLIC_SANITY_API_VERSION.",
    );
  }
}
