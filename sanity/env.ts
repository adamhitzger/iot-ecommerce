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
  "skJ7l55ZytcaEXVp7cI9MhIAnAfFWZrKKvjV2Iu2r0NIr5Asj5McWFzLg8e2GklyjdqWR0gYw7kMZhlRzS7og985d1qkSSEJLf07LgvEVHSEPxMGVwQ7QKWy1vbn48mQ51Ouv4B0zjhApLDXjHTyEyvFJpAJmn90tXbbvx7xkIBgssQtj2wI",
  'Missing environment variable: SANITY_AUTH_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
