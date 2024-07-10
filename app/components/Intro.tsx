import type { HTMLAttributes, ReactNode } from "react"
import { VariantProps, cva, cx } from "~/utils/cva"
import { Heading, type HeadingProps } from "./Heading"
import { Prose } from "./Prose"
import { Series } from "./Series"

const introVariants = cva({
  base: "flex w-full flex-col gap-y-2",

  variants: {
    alignment: {
      start: "items-start text-start",
      center: "items-center text-center",
      end: "items-end text-end",
    },
  },

  defaultVariants: {
    alignment: "start",
  },
})

type IntroProps = Omit<HTMLAttributes<HTMLElement>, "title" | "prefix"> &
  VariantProps<typeof introVariants> & {
    title: ReactNode
    description?: ReactNode
    prefix?: ReactNode
    suffix?: ReactNode
    headingProps?: HeadingProps
  }

export const Intro = ({
  children,
  className,
  alignment,
  title,
  description,
  prefix,
  suffix,
  headingProps = { size: "h1" },
  ...props
}: IntroProps) => {
  return (
    <div className={cx(introVariants({ alignment, className }))} {...props}>
      <Series size="lg" className="relative w-full">
        {prefix}
        {title && <Heading {...headingProps}>{title}</Heading>}
        {suffix}

        <div className="absolute -bottom-2 inset-x-0 h-8 bg-gradient-to-t from-background/40 to-transparent pointer-events-none select-none" />
      </Series>

      {description && (
        <Prose className="max-w-2xl">
          <h2 className="!text-base !font-normal !tracking-normal !text-secondary md:!text-lg">
            {description}
          </h2>
        </Prose>
      )}

      {children}
    </div>
  )
}
