type ImageLoaderProps = {
  src: string
  width: number
  quality?: number
}

const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src
}

const createParamsString = ({ width, quality }: Omit<ImageLoaderProps, "src">) => {
  const params = [`width=${width}`]
  if (quality) params.push(`quality=${quality}`)
  return params.join(",")
}

export default function cloudflareLoader({ src, width, quality }: ImageLoaderProps) {
  if (process.env.NODE_ENV === "development") return `${src}?w=${width}`

  return `/cdn-cgi/image/${createParamsString({ width, quality })}/${normalizeSrc(src)}`
}
