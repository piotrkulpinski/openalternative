import { HTMLAttributes } from "react"
import { LanguageMany } from "~/services.server/api"
import { CardSimple } from "../CardSimple"

type LanguageRecordProps = HTMLAttributes<HTMLElement> & {
  language: LanguageMany
}

export const LanguageRecord = ({ language, ...props }: LanguageRecordProps) => {
  return (
    <CardSimple
      to={`/languages/${language.slug}`}
      label={language.name}
      caption={`${language.tools.length} tools`}
      {...props}
    />
  )
}
