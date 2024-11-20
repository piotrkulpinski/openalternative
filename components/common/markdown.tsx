import Link from "next/link"
import type { ComponentProps } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import { Prose } from "~/components/common/prose"

export const Markdown = ({ children, ...props }: ComponentProps<typeof Prose>) => {
  const components: Components = {
    a: ({ children, href, ...props }) => {
      if (href?.startsWith("/")) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        )
      }

      return (
        <a href={href} target="_blank" rel="noreferrer nofollow" {...props}>
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
