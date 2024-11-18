import type { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

export const Prose = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={cx(
        "prose prose-neutral dark:prose-invert prose-a:font-normal prose-a:text-foreground hover:prose-a:text-primary first:prose-p:mt-0 last:prose-p:mb-0 first:prose-ul:mt-0 last:prose-ul:mb-0 prose-li:mt-2 first:prose-li:m-0 prose-img:border prose-img:border-neutral-200 prose-img:rounded-md prose-lead:text-lg/relaxed prose-pre:font-mono prose-pre:rounded-none text-secondary text-pretty leading-relaxed",
        "prose-headings:scroll-mt-20 prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-h1:text-3xl md:prose-h1:text-4xl prose-h2:text-2xl md:prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-base prose-h5:font-medium prose-h5:tracking-micro prose-h6:text-sm prose-h6:font-medium prose-h6:tracking-normal",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
