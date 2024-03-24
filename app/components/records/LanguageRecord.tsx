import { HTMLAttributes } from "react"
import plur from "plur"
import { LanguageMany } from "~/services.server/api"
import { CardSimple } from "~/components/CardSimple"
import { SerializeFrom } from "@remix-run/node"

type LanguageRecordProps = HTMLAttributes<HTMLElement> & {
  language: SerializeFrom<LanguageMany>
}

export const LanguageRecord = ({ language, ...props }: LanguageRecordProps) => {
  return (
    <CardSimple
      to={`/languages/${language.slug}`}
      label={language.name}
      caption={`${language._count.tools} ${plur("tool", language._count.tools)}`}
      {...props}
    />
  )
}
