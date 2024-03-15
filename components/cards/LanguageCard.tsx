import { Card } from "~/components/Card"
import { ComponentPropsWithoutRef } from "react"
import { Language } from "~/queries/languages"

type LanguageCardProps = Omit<ComponentPropsWithoutRef<typeof Card>, "href"> & {
  language: Partial<Language>
}

export const LanguageCard = ({ language, ...props }: LanguageCardProps) => {
  const count = language.tools?.length || 0

  return (
    <Card href={`/language/${language.slug}`} {...props}>
      <div className="flex w-full items-center justify-between gap-3">
        <h2 className="flex-1 truncate text-lg font-semibold">{language.name}</h2>
        <strong className="mr-0.5 text-gray-400">{count}</strong>
      </div>
    </Card>
  )
}
