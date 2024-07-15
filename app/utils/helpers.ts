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
