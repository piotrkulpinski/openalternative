import qs from "qs"

type FetcherProps = {
  url: string
  params: Record<string, unknown>
}

export const fetcher = async ({ url, ...params }: FetcherProps) => {
  const r = await fetch(`${url}?${qs.stringify(params)}`)
  return r.json()
}
