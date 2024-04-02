import { HTMLAttributes, ReactNode } from "react"
import { cx } from "~/utils/cva"
import { Prose } from "./Prose"
import { Series } from "./Series"
import { H1 } from "./Heading"

type IntroProps = Omit<HTMLAttributes<HTMLElement>, "title" | "prefix"> & {
  title: ReactNode
  description?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
}

export const Intro = ({
  children,
  className,
  title,
  description,
  prefix,
  suffix,
  ...props
}: IntroProps) => {
  return (
    <div className={cx("flex w-full flex-col items-start gap-y-2", className)} {...props}>
      <Series size="lg" className="w-full">
        {prefix}
        <H1>{title}</H1>
        {suffix}
      </Series>

      {description && (
        <Prose className="max-w-3xl">
          <h2 className="lead !font-normal !tracking-normal !text-neutral-600 dark:!text-neutral-400">
            {description}
          </h2>
        </Prose>
      )}

      {children}
    </div>
  )
}
