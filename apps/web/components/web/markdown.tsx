import type { ComponentProps } from "react"
import ReactMarkdown from "react-markdown"
import { Prose } from "~/components/common/prose"
import { MDXComponents } from "~/components/web/mdx-components"

type MarkdownProps = ComponentProps<typeof Prose> & {
  code: string
}

export const Markdown = ({ code, ...props }: MarkdownProps) => {
  return (
    <Prose {...props}>
      <ReactMarkdown components={MDXComponents}>{code}</ReactMarkdown>
    </Prose>
  )
}
