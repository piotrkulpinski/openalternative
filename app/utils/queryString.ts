/**
 * Updates the URL with the specified search parameters.
 *
 * @param url The original URL to be updated.
 * @param params An object containing key-value pairs to be set as search parameters.
 * @returns The updated URL with the new search parameters.
 */
export const updateUrlWithSearchParams = (
  url: string,
  params: { [key: string]: string },
): string => {
  // Create a URL object
  const urlObj = new URL(url)

  // Extract the search string, update it with new parameters, and get the updated search string
  const updatedSearchString = updateQueryString(urlObj.search, params)

  // Set the search parameters for the URL
  urlObj.search = updatedSearchString

  // Return the resulting URL with the updated search parameters
  return urlObj.toString()
}

/**
 * Updates a query string with the specified parameters.
 *
 * @param queryString The original query string to be updated.
 * @param params An object containing key-value pairs to be set as search parameters.
 * @returns The updated query string with the new search parameters.
 */
export const updateQueryString = (
  queryString: string,
  params: { [key: string]: string },
): string => {
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
 * Extracts and formats a search query from a given string.
 *
 * @param str The string to be formatted into a search query.
 * @returns The formatted search query string.
 */
export const getSearchQuery = (str: string | undefined | null) => {
  if (!str) return undefined

  return str.trim().replace(/\s+/g, " & ")
}
