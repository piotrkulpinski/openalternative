import { H1, Markdown, Prose, Series, cx, isReactElement } from "@curiousleaf/design"
import { HTMLAttributes, ReactNode } from "react"

type IntroProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  title?: string
  description?: string
}

export const Intro = ({ children, className, title, description, ...props }: IntroProps) => {
  return (
    <Series direction="column" className={cx("gap-y-7", className)} {...props}>
      {title && <H1>{title}</H1>}

      {description && (
        <Markdown size="lg" className="-mt-4 text-gray-600 first:mt-0" content={description} />
      )}

      {children}
    </Series>
  )
}
