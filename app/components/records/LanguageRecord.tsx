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
      label={
        <div className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: language.color ?? undefined }}
          />
          {language.name}
        </div>
      }
      caption={`${language._count.tools} ${plur("tool", language._count.tools)}`}
      {...props}
    />
  )
}
