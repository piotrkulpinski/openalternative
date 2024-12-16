export type Repository = {
  owner: string
  name: string
}

/**
 * Extracts the repository owner and name from a GitHub URL.
 *
 * @param url The GitHub URL from which to extract the owner and name.
 * @returns An object containing the repository owner and name, or null if the URL is invalid.
 */
export const getRepoOwnerAndName = (url: string | null): Repository | null => {
  if (!url) return null

  const match = url.match(
    /^(?:(?:https?:\/\/)?github\.com\/)?(?<owner>[^/]+)\/(?<name>[^/]+?)(?:\/|$)/,
  )

  return match?.groups as Repository | null
}
