import slugify, { type Options as SlugifyOptions } from "@sindresorhus/slugify"
import { type FormatDistanceOptions, formatDistance } from "date-fns"

/**
 * Formats a date using the `Intl.DateTimeFormat` function.
 *
 * @param date - The date to be formatted.
 * @param opts - Additional formatting options.
 * @returns The formatted date string.
 */
export function formatDate(date: Date | string | number, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date))
}

/**
 * Formats a date using the `formatDistance` function from `date-fns`,
 * removing the "about", "over", and "almost" prefixes.
 *
 * @param date - The date to be formatted.
 * @param options - Additional formatting options.
 * @returns The formatted date string.
 */
export const formatRelativeDate = (date: Date | string, options?: FormatDistanceOptions) => {
  return formatDistance(new Date(date), new Date(), options).replace(/about |over |almost /, "")
}

/**
 * Generate a slug from a name
 * @param name
 * @returns
 */
export const getSlug = (name: string, options: SlugifyOptions = {}) => {
  return slugify(name, {
    decamelize: false,
    ...options,
  })
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
 * Stole this from the @radix-ui/primitive
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event)

    if (checkForDefaultPrevented === false || !(event as unknown as Event).defaultPrevented) {
      return ourEventHandler?.(event)
    }
  }
}

/**
 * Converts null and undefined values to undefined
 * @param obj
 * @returns
 */
export function nullsToUndefined<T>(obj: T) {
  if (obj === null || obj === undefined) {
    return undefined as any
  }

  if ((obj as any).constructor.name === "Object" || Array.isArray(obj)) {
    for (const key in obj) {
      obj[key] = nullsToUndefined(obj[key]) as any
    }
  }
  return obj as any
}
