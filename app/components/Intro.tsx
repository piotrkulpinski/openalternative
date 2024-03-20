import { cx } from "cva"
import { HTMLAttributes } from "react"
import { Prose } from "./Prose"

type IntroProps = HTMLAttributes<HTMLElement> & {
  title: string
  description?: string
}

export const Intro = ({ className, title, description, ...props }: IntroProps) => {
  return (
    <Prose className={cx("space-y-2", className)} {...props}>
      <h1 className="m-0">{title}</h1>

      {description && <p className="lead mt-2">{description}</p>}
    </Prose>
  )
}
