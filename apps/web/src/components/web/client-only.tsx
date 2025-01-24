"use client"

/**
 * Hack to work around next.js hydration
 * @see https://github.com/uidotdev/usehooks/issues/218
 */
import { useIsClient } from "@uidotdev/usehooks"
import type { FC, ReactNode } from "react"

type ClientOnlyProps = {
  children: ReactNode
  fallback?: ReactNode
}

export const ClientOnly: FC<ClientOnlyProps> = ({ children, fallback }) => {
  const isClient = useIsClient()

  // Render children if on client side, otherwise return null
  return isClient ? <>{children}</> : fallback
}
