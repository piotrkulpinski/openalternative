import { siteConfig } from "~/config/site"

/**
 * Updates a search string with the specified parameters.
 *
 * @param queryString The original query string to be updated.
 * @param params An object containing key-value pairs to be set as search parameters.
 * @returns The updated query string with the new search parameters.
 */
const updateSearchParams = (queryString: string, params: { [key: string]: string }): string => {
  // Create a URLSearchParams object from the query string
  const searchParams = new URLSearchParams(queryString)

  // Add/remove search parameters based on the provided value
  for (const [key, value] of Object.entries(params)) {
    if (!value) {
      searchParams.delete(key)
    } else {
      searchParams.set(key, value)
    }
  }

  // Return the updated search string
  return searchParams.toString()
}

/**
 * Updates the URL with the specified search parameters.
 *
 * @param url The original URL to be updated.
 * @param params An object containing key-value pairs to be set as search parameters.
 * @returns The updated URL with the new search parameters.
 */
export const addSearchParams = (url: string, params: { [key: string]: string }): string => {
  // If the URL is not a full URL, return it as is
  if (!url.startsWith("http") || url.startsWith(siteConfig.affiliateUrl)) return url

  // Create a URL object
  const urlObj = new URL(url)

  // Extract the search string, update it with new parameters, and get the updated search string
  const updatedSearchString = updateSearchParams(urlObj.search, params)

  // Set the search parameters for the URL
  urlObj.search = updatedSearchString

  // Return the resulting URL with the updated search parameters
  return urlObj.toString()
}
