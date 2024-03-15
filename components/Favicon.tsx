import { cx } from "@curiousleaf/design"
import Image from "next/image"
import { HTMLAttributes } from "react"
import { Box } from "./Box"

type LogoProps = HTMLAttributes<HTMLElement> & {
  url?: string | null
}

export const Favicon = ({ children, className, url, ...props }: LogoProps) => {
  if (!url) {
    return null
  }

  const faviconParams = new URLSearchParams({
    url,
    size: "64",
    client: "SOCIAL",
    type: "FAVICON",
    fallback_opts: "TYPE,SIZE,URL",
  })

  const faviconUrl = `https://t0.gstatic.com/faviconV2?${faviconParams.toString()}`

  return (
    <Box className={cx("flex size-11 items-center justify-center", className)} {...props}>
      <Image
        src={faviconUrl}
        alt=""
        width={64}
        height={64}
        loading="eager"
        className="aspect-square size-full rounded"
      />
    </Box>
  )
}
