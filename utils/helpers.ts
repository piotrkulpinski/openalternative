export const convertTextToLink = (haystack: string, needle: string | null, url: string | null) => {
  if (!needle || !url) {
    return haystack
  }

  const template = `<a href="${url}" target="_blank" rel="noopener noreferrer nofollow">${needle}</a>`

  return haystack.replace(needle, template)
}

export const addSearchParamsToUrl = (url: string, params: { [key: string]: string }) => {
  // Create a URL object
  const urlObj = new URL(url)

  // Retrieve existing search parameters or create new if none exist
  const searchParams = new URLSearchParams(urlObj.search)

  // Add new search parameters to the existing ones
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value)
  }

  // Set the search parameters for the URL
  urlObj.search = searchParams.toString()

  // Return the resulting URL with the updated search parameters
  return urlObj.toString()
}
