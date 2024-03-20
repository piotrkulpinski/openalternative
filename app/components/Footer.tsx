import { cx } from "cva"
import { HTMLAttributes } from "react"

export const Footer = ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <footer className={cx("text-sm text-neutral-500", className)} {...props}>
      © {new Date().getFullYear()} &middot;{" "}
      <a
        href="https://github.com/piotrkulpinski/openalternative"
        target="_blank"
        rel="nofollow noreferrer"
        className="hover:text-black hover:underline dark:hover:text-white"
      >
        Source
      </a>
      {children}
    </footer>
  )
}
