import wretch from "wretch"

type Success<T> = {
  data: T
  error: null
}

type Failure<E> = {
  data: null
  error: E
}

type Result<T, E = Error> = Success<T> | Failure<E>

/**
 * Wraps a promise and returns a result object with the data or error
 * @param promise - The promise to wrap
 * @returns A result object with the data or error
 */
export const tryCatch = async <T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> => {
  try {
    const data = await promise
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as E }
  }
}

/**
 * Checks if an email is a disposable email by checking if the domain is in the disposable domains list
 * @param email
 * @returns
 */
export const isDisposableEmail = async (email: string) => {
  const disposableJsonURL =
    "https://rawcdn.githack.com/disposable/disposable-email-domains/master/domains.json"

  const disposableDomains = await wretch(disposableJsonURL).get().json<string[]>()
  const domain = email.split("@")[1]

  return disposableDomains.includes(domain)
}

type Metadata = {
  title: string
  description: string
  image: string
}

/**
 * Get the URL metadata
 * @param url - The URL to get the metadata for
 * @returns The metadata
 */
export const getUrlMetadata = async (url: string) => {
  const api = wretch(`https://api.dub.co/metatags?url=${url}`)
  const { data, error } = await tryCatch(api.get().json<Metadata>())

  if (error) {
    console.error("Error fetching metadata:", error)
    return
  }

  return data
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
