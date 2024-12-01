import type { ComponentProps } from "react"
import ReactMarkdown from "react-markdown"
import { MDXComponents } from "~/components/web/mdx-components"
import { Prose } from "~/components/web/ui/prose"

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
