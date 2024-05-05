import type { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

export const Prose = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={cx(
        "prose prose-neutral dark:prose-invert prose-a:font-normal prose-a:text-foreground hover:prose-a:text-pink-500 first:prose-p:mt-0 last:prose-p:mb-0 first:prose-ul:mt-0 last:prose-ul:mb-0 prose-li:m-0 prose-img:border prose-img:border-neutral-200 prose-img:rounded-md prose-lead:text-lg/relaxed prose-pre:font-mono prose-pre:rounded-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground text-secondary",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
