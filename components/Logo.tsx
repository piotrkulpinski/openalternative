import { Series, cx } from "@curiousleaf/design"
import Link from "next/link"
import Image from "next/image"
import { HTMLAttributes } from "react"

type LogoProps = HTMLAttributes<HTMLElement> & {
  loading?: "eager" | "lazy"
}

export const Logo = ({ children, className, loading = "eager", ...props }: LogoProps) => {
  return (
    <Series size="sm" className={cx("font-semibold leading-tight", className)} asChild {...props}>
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="Logo"
          height="100"
          width="97"
          loading={loading}
          className="h-6 w-auto"
        />
        {children}
      </Link>
    </Series>
  )
}
