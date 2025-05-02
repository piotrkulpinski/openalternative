import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

export const Prose = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={cx(
        "text-secondary-foreground text-pretty leading-relaxed",
        "prose prose-neutral dark:prose-invert prose-a:font-medium prose-a:text-foreground prose-a:decoration-foreground/30 prose-a:hover:text-primary prose-a:hover:decoration-primary/60 prose-strong:text-foreground prose-p:first:mt-0 prose-p:last:mb-0 prose-ul:first:mt-0 prose-ul:last:mb-0 prose-li:mt-2 prose-li:first:m-0 prose-img:border prose-img:rounded-md prose-lead:text-lg/relaxed prose-pre:font-mono prose-pre:rounded-none",
        "prose-headings:scroll-mt-20 prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-code:before:hidden prose-code:after:hidden prose-code:bg-foreground/10 prose-code:rounded prose-code:mx-[0.088em] prose-code:px-[0.33em] prose-code:py-[0.166em] prose-code:font-normal",
        "prose-h1:text-3xl md:prose-h1:text-4xl prose-h2:text-2xl md:prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-base prose-h5:font-medium prose-h5:tracking-micro prose-h6:text-sm prose-h6:font-medium prose-h6:tracking-normal",
        className,
      )}
      {...props}
    />
  )
}
