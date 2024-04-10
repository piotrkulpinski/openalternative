import { HTMLAttributes, ReactNode } from "react"
import { cx } from "~/utils/cva"
import { Prose } from "./Prose"
import { Series } from "./Series"
import { Heading, HeadingProps } from "./Heading"

type IntroProps = Omit<HTMLAttributes<HTMLElement>, "title" | "prefix"> & {
  title: ReactNode
  description?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
  headingProps?: HeadingProps
}

export const Intro = ({
  children,
  className,
  title,
  description,
  prefix,
  suffix,
  headingProps= {size: "h1"},
  ...props
}: IntroProps) => {
  return (
    <div className={cx("flex w-full flex-col items-start gap-y-2", className)} {...props}>
      <Series size="lg" className="relative w-full">
        {prefix}
        {title && <Heading {...headingProps}>{title}</Heading>}
        {suffix}

        <div className="absolute -bottom-2 inset-x-0 h-8 bg-gradient-to-t from-background/40 to-transparent pointer-events-none select-none" />
      </Series>

      {description && (
        <Prose className="max-w-3xl">
          <h2 className="lead !font-normal !tracking-normal !text-secondary">{description}</h2>
        </Prose>
      )}

      {children}
    </div>
  )
}
