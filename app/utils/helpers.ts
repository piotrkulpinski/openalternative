/**
 * Determines if the given user agent string indicates a mobile device.
 *
 * @param userAgent The user agent string to be checked.
 * @returns A boolean indicating whether the user agent belongs to a mobile device.
 */
export const isMobileAgent = (userAgent: string | null) => {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ]

  return toMatch.some(toMatchItem => userAgent?.match(toMatchItem))
}

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
export const joinAsSentence = (items: string[], maxItems = 3) => {
  return items
    .slice(0, maxItems)
    .join(", ")
    .replace(/, ([^,]*)$/, " and $1")
}
