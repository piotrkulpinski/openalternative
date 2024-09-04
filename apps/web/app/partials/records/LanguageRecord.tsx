import type { SerializeFrom } from "@remix-run/node"
import { CardSimple } from "apps/web/app/components/CardSimple"
import type { LanguageMany } from "apps/web/app/services.server/api"
import plur from "plur"
import type { HTMLAttributes } from "react"

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
