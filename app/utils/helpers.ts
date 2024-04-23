import { DAY_IN_MS, PH_LAUNCHES } from "./constants"

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

  return toMatch.some((toMatchItem) => userAgent?.match(toMatchItem))
}

/**
 * Retrieves a random product launch for the current day from the predefined list of product launches.
 *
 * @returns An object representing a product launch or undefined if there are no launches for the current day.
 */
export const getCurrentPHLaunch = () => {
  const launches = PH_LAUNCHES.filter(({ date }) => {
    const currentTime = Date.now()
    const startTime = Date.parse(`${date} 07:00:00 GMT`)
    const endTime = startTime + DAY_IN_MS

    return currentTime >= startTime && currentTime <= endTime
  })

  if (launches.length === 0) {
    return
  }

  return launches[Math.floor(Math.random() * launches.length)]
}
