"use client"

import NextImage, { type ImageProps } from "next/image"
import { cloudinaryLoader } from "~/lib/cloudinary"

export const Image = (props: ImageProps) => {
  return (
    <NextImage
      {...props}
      loader={props.src.toString().startsWith("http") ? cloudinaryLoader : undefined}
    />
  )
}
