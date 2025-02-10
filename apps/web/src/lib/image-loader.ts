type ImageLoaderProps = {
  src: string
  width: number
  quality?: number
}

const normalizeSrc = (src: string) => {
  return encodeURIComponent(src.startsWith("/") ? src.slice(1) : src)
}

const getParamsString = ({ width, quality }: Omit<ImageLoaderProps, "src">) => {
  const paramsObj = {
    width,
    quality: quality || 75,
    format: "avif",
    metadata: "none",
  }

  return Object.entries(paramsObj)
    .map(([key, value]) => `${key}=${value}`)
    .join(",")
}

export default function cloudflareLoader({ src, width, quality }: ImageLoaderProps) {
  if (process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview") {
    return `${src}?w=${width}`
  }

  return `/cdn-cgi/image/${getParamsString({ width, quality })}/${normalizeSrc(src)}`
}
