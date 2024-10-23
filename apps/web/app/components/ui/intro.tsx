import type { HTMLAttributes, ReactNode } from "react"
import { Heading, type HeadingProps } from "~/components/ui/heading"
import { Prose } from "~/components/ui/prose"
import { type VariantProps, cva, cx } from "~/utils/cva"

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
    title?: ReactNode
    description?: ReactNode
  }

const Intro = ({ children, className, alignment, title, description, ...props }: IntroProps) => {
  return (
    <div className={cx(introVariants({ alignment, className }))} {...props}>
      {title && <IntroTitle>{title}</IntroTitle>}
      {description && <IntroDescription>{description}</IntroDescription>}
      {children}
    </div>
  )
}

const IntroTitle = ({ size = "h1", ...props }: HeadingProps) => {
  return <Heading size={size} {...props} />
}

const IntroDescription = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <Prose className={cx("max-w-2xl", className)} {...props}>
      <h2 className="!text-base !font-normal !tracking-normal !text-foreground/70 md:!text-lg">
        {children}
      </h2>
    </Prose>
  )
}

export { Intro, IntroTitle, IntroDescription }
