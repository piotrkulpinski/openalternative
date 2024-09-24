import { type FormatDistanceOptions, formatDistance } from "date-fns"

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
 * Adds UTM tracking to the provided link
 * It uses the search params and accepts source, medium and campaign which are optional
 * It should not strip any existing search params
 */
export const addUTMTracking = (
  url: string,
  utm: { source: string; medium?: string; campaign?: string },
) => {
  const urlObj = new URL(url)
  const searchParams = urlObj.searchParams

  if (utm.source) searchParams.set("utm_source", utm.source)
  if (utm.medium) searchParams.set("utm_medium", utm.medium)
  if (utm.campaign) searchParams.set("utm_campaign", utm.campaign)

  urlObj.search = searchParams.toString()
  return urlObj.toString()
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

/**
 * Formats a date using the `formatDistance` function from `date-fns`,
 * removing the "about", "over", and "almost" prefixes.
 *
 * @param date - The date to be formatted.
 * @param options - Additional formatting options.
 * @returns The formatted date string.
 */
export const formatDate = (date: Date | string, options?: FormatDistanceOptions) => {
  return formatDistance(new Date(date), new Date(), options).replace(/about |over |almost /, "")
}
