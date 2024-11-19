import Link from "next/link"
import type { HTMLAttributes } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import rehypeSlug from "rehype-slug"
import { Prose } from "~/components/common/prose"

export const Markdown = ({ children, ...props }: HTMLAttributes<HTMLElement>) => {
  const components: Components = {
    a: ({ children, href }) => {
      if (href?.startsWith("/")) {
        return (
          <Link href={href} prefetch>
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
      <ReactMarkdown components={components} rehypePlugins={[rehypeSlug]}>
        {(children as string)?.replace(/\\n/gi, "  \n")}
      </ReactMarkdown>
    </Prose>
  )
}
