import { cx } from "cva"
import { HTMLAttributes, ReactNode } from "react"
import { Prose } from "./Prose"

type IntroProps = HTMLAttributes<HTMLElement> & {
  title: string
  description?: ReactNode
}

export const Intro = ({ className, title, description, ...props }: IntroProps) => {
  return (
    <Prose className={cx("max-w-none space-y-2", className)} {...props}>
      <h1 className="m-0">{title}</h1>

      {description && <p className="lead mt-2 text-balance">{description}</p>}
    </Prose>
  )
}
