import type { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

export const SectionBase = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={cx("grid grid-cols-1 items-start gap-6 md:grid-cols-3 lg:gap-8", className)}
      {...props}
    />
  )
}

export const SectionContent = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={cx("flex flex-col gap-8 md:col-span-2 md:gap-10 lg:gap-12", className)}
      {...props}
    />
  )
}

export const SectionSidebar = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={cx(
        "flex flex-col gap-6 w-full md:sticky md:top-16 md:z-10 md:max-h-[calc(100vh-5rem)]",
        className,
      )}
      style={{ viewTransitionName: "sidebar" }}
      {...props}
    />
  )
}

export const Section = Object.assign(SectionBase, {
  Content: SectionContent,
  Sidebar: SectionSidebar,
})
