import Firecrawl from "@mendable/firecrawl-js"
import { env } from "~/env"

export const firecrawlClient = new Firecrawl({
  apiKey: env.FIRECRAWL_API_KEY,
})
