import { siteConfig } from "~/config/site"

export default function SitePage() {
  return (
    <iframe
      src={siteConfig.url}
      title="Site Preview"
      className="-m-4 w-[calc(100%+2rem)] h-[calc(100vh)] sm:-mx-6 sm:w-[calc(100%+3rem)]"
    />
  )
}
