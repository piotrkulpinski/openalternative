import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"
import { H5 } from "~/components/common/heading"
import { type VariantProps, cva, cx } from "~/utils/cva"

const cardSimpleVariants = cva({
  base: "fade-in group -my-2 flex min-w-0 items-center gap-4 py-2",

  variants: {
    isRevealed: {
      true: "animate-reveal",
    },
  },

  defaultVariants: {
    isRevealed: true,
  },
})

type CardSimpleProps = ComponentProps<typeof Link> &
  VariantProps<typeof cardSimpleVariants> & {
    label: ReactNode
    caption?: ReactNode
  }

export const CardSimple = ({
  className,
  label,
  caption,
  isRevealed,
  ...props
}: CardSimpleProps) => {
  return (
    <Link className={cx(cardSimpleVariants({ isRevealed, className }))} {...props}>
      <H5 as="h3" className="truncate group-hover:underline">
        {label}
      </H5>

      <hr className="min-w-2 flex-1" />
      {caption && <span className="shrink-0 text-xs text-secondary">{caption}</span>}
    </Link>
  )
}
