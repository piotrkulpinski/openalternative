import wretch from "wretch"
import { env } from "~/env"
import { getErrorMessage } from "~/lib/handle-error"
import { tryCatch } from "~/utils/helpers"

type JinaResponse = {
  data: {
    title: string
    description: string
    url: string
    content: string
  }
}

/**
 * Scrapes a website and returns the scraped data using Jina.ai's Reader API.
 * @param url The URL of the website to scrape.
 * @returns The scraped data.
 */
export const scrapeWebsiteData = async (url: string) => {
  let jinaApi = wretch("https://r.jina.ai").headers({
    Accept: "application/json",
    "X-Engine": "cf-browser-rendering",
    "X-Remove-Selector": "img, video, iframe, a",
    "X-Retain-Images": "none",
    "X-Return-Format": "markdown",
  })

  if (env.JINA_API_KEY) {
    jinaApi = jinaApi.auth(`Bearer ${env.JINA_API_KEY}`)
  }

  const { data, error } = await tryCatch(jinaApi.post({ url }).json<JinaResponse>())

  if (error) {
    throw new Error(getErrorMessage(error))
  }

  return data.data
}
