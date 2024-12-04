import { unstable_cache as next_cache } from "next/cache"
import { cache as react_cache } from "react"

// next_unstable_cache doesn't handle deduplication, so we wrap it in React's cache
export const cache = <Inputs extends unknown[], Output>(
  callback: (...args: Inputs) => Promise<Output>,
  key?: string[],
  options?: { revalidate: number },
) => {
  // Set this to true to bypass all caching
  const DISABLE_CACHE = false

  return DISABLE_CACHE
    ? callback
    : react_cache(next_cache(callback, undefined, { tags: key, ...options }))
}
