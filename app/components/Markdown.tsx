import type { HTMLAttributes } from "react"
import ReactMarkdown, { Components } from "react-markdown"
import { Prose } from "./Prose"
import { Link } from "@remix-run/react"

export const Markdown = ({ children, ...props }: HTMLAttributes<HTMLElement>) => {
  const components: Components = {
    a: ({ children, href }) => {
      if (href?.startsWith("/")) {
        return (
          <Link to={href} prefetch="intent" unstable_viewTransition>
            {children}
          </Link>
        )
      }

      return (
        <a href={href} target="_blank" rel="noreferrer nofollow">
          {children}
        </a>
      )
    },
  }

  return (
    <Prose {...props}>
      <ReactMarkdown components={components}>
        {(children as string)?.replace(/\\n/gi, "  \n")}
      </ReactMarkdown>
    </Prose>
  )
}
