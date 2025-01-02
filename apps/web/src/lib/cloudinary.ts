import type { ImageLoaderProps } from "next/image"
import { env } from "~/env"

const normalizeSrc = (src: string) => {
  return src.replace(/^\//, "")
}

export const cloudinaryLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`]
  return `https://res.cloudinary.com/${cloudName}/image/fetch/${params.join(",")}/${normalizeSrc(src)}`
}
