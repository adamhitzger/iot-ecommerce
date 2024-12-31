export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-12-05'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skElMZpxduHG0xgj46ztJCLaRQZL9cDJ536M4LMuD3C8pWdn4ZmWkXFd2jTHP3K2hVj7O6zy1ky48iRn1KOFvwcdNS0MlfUjFxtmN7g7puBGF7BSXe29bAp63iEHnTb2K8J5GR7pt72RzuZRbtLz4Fm953RWWIyaTP824gyhmlwMib6XxdRp",
  'Missing environment variable: SANITY_AUTH_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
