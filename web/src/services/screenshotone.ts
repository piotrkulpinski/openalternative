import * as screenshotone from "screenshotone-api-sdk"
import { env } from "~/variables"

const client = new screenshotone.Client(env.SCREENSHOTONE_ACCESS_KEY, env.SCREENSHOTONE_SECRET_KEY)

export const getScreenshotUrl = (url: string, filename: string) => {
  const options = screenshotone.TakeOptions.url(url)
    .cache(true)
    .cacheTtl(2000000)
    .blockChats(true)
    .blockTrackers(true)
    .blockCookieBanners(true)
    .blockAds(true)
    .store(true)
    .storagePath(`openalternative/${filename}`)

  return client.generateSignedTakeURL(options)
}
