import queryString from "query-string"

type FetcherProps = {
  url: string
  params: Record<string, unknown>
}

export const fetcher = async ({ url, ...params }: FetcherProps) => {
  const r = await fetch(`${url}?${queryString.stringify(params)}`, { method: "GET" })
  return r.json()
}
