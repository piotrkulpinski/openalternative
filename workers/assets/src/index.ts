export type Env = {
  // Learn more at https://developers.cloudflare.com/workers/configuration/environment-variables/
  R2_PUBLIC_URL: string
  AIRTABLE_TOKEN: string
  AIRTABLE_BASE_ID: string
  AIRTABLE_TABLE_ID: string
  SCREENSHOTONE_ACCESS_KEY: string

  // Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  R2_BUCKET: R2Bucket
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 })
    }

    // const json = await request.json()
    // console.log(json)
    console.log(JSON.stringify(request.body))

    return new Response(null)

    // Upload favicon and screenshot to R2 if not available
    // for (const record of records) {
    //   const bucket = env.R2_BUCKET
    //   const repo = repos.find(({ id }) => id === record.id) as Repository
    //   const { slug, website, favicon, screenshot } = repo

    //   if (website && !favicon) {
    //     const faviconParams = new URLSearchParams({
    //       url: website,
    //       size: "64",
    //       client: "SOCIAL",
    //       type: "FAVICON",
    //       fallback_opts: "TYPE,SIZE,URL",
    //     })

    //     const url = `https://t0.gstatic.com/faviconV2?${faviconParams.toString()}`
    //     const filename = `${slug}-favicon.png`
    //     const uploadResponse = await uploadImageToR2({ url, filename, bucket })
    //     record.fields.Favicon = `${env.R2_PUBLIC_URL}/${uploadResponse?.key}`
    //   }

    //   if (website && !screenshot) {
    //     const screenshotParams = new URLSearchParams({
    //       access_key: env.SCREENSHOTONE_ACCESS_KEY,
    //       url: website,
    //       cache: "true",
    //       cache_ttl: "2000000",
    //       block_ads: "true",
    //       block_chats: "true",
    //       block_trackers: "true",
    //       block_cookie_banners: "true",
    //       format: "webp",
    //     })

    //     const url = `https://api.screenshotone.com/take?${screenshotParams.toString()}`
    //     const filename = `${slug}-screenshot.webp`
    //     const uploadResponse = await uploadImageToR2({ url, filename, bucket })
    //     record.fields.Screenshot = `${env.R2_PUBLIC_URL}/${uploadResponse?.key}`
    //   }
    // }
  },
}
