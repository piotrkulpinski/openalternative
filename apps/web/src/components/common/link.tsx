"use client"

import NextLink from "next/link"
import { type ComponentProps, useState } from "react"

export const Link = ({ prefetch: nextPrefetch, ...props }: ComponentProps<typeof NextLink>) => {
  const [prefetch, setPrefetch] = useState(nextPrefetch ?? false)

  return <NextLink prefetch={prefetch} onMouseEnter={() => setPrefetch(true)} {...props} />
}
