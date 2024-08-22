import type { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

export const SectionBase = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return <div className={cx("flex flex-col items-start gap-8 md:flex-row", className)} {...props} />
}

export const SectionContent = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div className={cx("flex flex-col gap-8 flex-1 md:gap-10 lg:gap-12", className)} {...props} />
  )
}

export const SectionSidebar = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={cx(
        "flex flex-col gap-8 w-full md:sticky md:top-16 md:z-10 md:max-h-[calc(100vh-5rem)] md:w-60 lg:w-64",
        className,
      )}
      {...props}
    />
  )
}

export const Section = Object.assign(SectionBase, {
  Content: SectionContent,
  Sidebar: SectionSidebar,
})
