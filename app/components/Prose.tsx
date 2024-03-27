import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

export const Prose = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={cx(
        "prose prose-neutral dark:prose-invert prose-a:font-normal prose-a:text-black dark:prose-a:text-white hover:prose-a:text-pink-500 first:prose-p:mt-0 last:prose-p:mb-0 first:prose-ul:mt-0 last:prose-ul:mb-0 prose-li:m-0 prose-img:border prose-img:border-neutral-200 prose-img:rounded-md prose-lead:text-lg/relaxed prose-pre:font-mono prose-pre:rounded-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-neutral-800 dark:prose-headings:text-neutral-200 text-neutral-600 dark:text-neutral-400",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
