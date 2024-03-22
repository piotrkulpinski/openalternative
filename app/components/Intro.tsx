import { Slot } from "@radix-ui/react-slot"
import { HTMLAttributes, ReactNode } from "react"
import { cx } from "~/utils/cva"
import { Prose } from "./Prose"
import { Series } from "./Series"
import { H1 } from "./Heading"

type IntroProps = Omit<HTMLAttributes<HTMLElement>, "prefix"> & {
  title: string
  description?: ReactNode
  prefix?: ReactNode
}

export const Intro = ({ className, title, description, prefix, ...props }: IntroProps) => {
  return (
    <div className={cx("flex flex-col items-start gap-y-2", className)} {...props}>
      <Series size="lg">
        <Slot>{prefix}</Slot>
        <H1>{title}</H1>
      </Series>

      {description && (
        <Prose>
          <h2 className="lead !font-normal !tracking-normal !text-neutral-600 dark:!text-neutral-400">
            {description}
          </h2>
        </Prose>
      )}
    </div>
  )
}
