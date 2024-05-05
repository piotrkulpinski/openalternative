import { RemixServer } from "@remix-run/react"
import { handleRequest } from "@vercel/remix"
import type { EntryContext } from "@vercel/remix"

export default function (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const remixServer = <RemixServer context={remixContext} url={request.url} />

  responseHeaders.set("Content-Type", "text/html")
  responseHeaders.set("Cache-Control", "s-maxage=180")

  return handleRequest(request, responseStatusCode, responseHeaders, remixServer)
}
