import { type FormatDistanceOptions, formatDistance } from "date-fns"

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
