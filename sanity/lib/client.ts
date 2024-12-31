import { createClient } from 'next-sanity'
import type { ClientPerspective, QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId, token} from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token: token,
})

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  perspective = "published",
  stega = perspective === "previewDrafts" ||
    process.env.VERCEL_ENV === "preview",
}: {
  query: string;
  params?: QueryParams;
  perspective?: Omit<ClientPerspective, "raw">;
  stega?: boolean;
}) {
  
  return client.fetch<QueryResponse>(query, params, {
    stega,
    perspective: "published",
    useCdn: true,
    next: { revalidate: 30 },
  });
}