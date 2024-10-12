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
 * Returns the position of an element with the given ID relative to the top of the viewport.
 * @param slug - The slug of the element to get the position of.
 * @returns An object with the ID and top position of the element, or undefined if the element is not found.
 */
export const getElementPosition = (id?: string) => {
  const el = document.getElementById(id || "")
  if (!el) return

  const style = window.getComputedStyle(el)
  const scrollMt = Number.parseFloat(style.scrollMarginTop)
  const top = Math.floor(window.scrollY + el.getBoundingClientRect().top - scrollMt)

  return { id, top }
}
