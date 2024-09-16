/**
 * Strips the subpath from a URL, returning only the protocol and host.
 *
 * @param url The URL to be stripped.
 * @returns The URL with the subpath removed.
 */
export const stripURLSubpath = (url: string) => {
  try {
    const parsedUrl = new URL(url)
    return `${parsedUrl.protocol}//${parsedUrl.host}`
  } catch (error) {
    // If the URL is invalid, return the original string
    return url
  }
}

/**
 * Joins an array of strings into a sentence, with a maximum of 3 items.
 *
 * @param items The array of strings to be joined.
 * @param maxItems The maximum number of items to include in the sentence.
 * @returns The joined sentence.
 */
export const joinAsSentence = (items: string[], maxItems = 3, lastItem = "and") => {
  return items
    .slice(0, maxItems)
    .join(", ")
    .replace(/, ([^,]*)$/, ` ${lastItem} $1`)
}
