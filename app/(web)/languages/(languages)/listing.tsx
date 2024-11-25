import type { Prisma } from "@prisma/client"
import { LanguageList } from "~/components/web/languages/language-list"
import { findLanguages } from "~/server/languages/queries"

type LanguageListingProps = {
  where?: Prisma.LanguageWhereInput
}

export const LanguageListing = async ({ where }: LanguageListingProps) => {
  const languages = await findLanguages({ where })

  return <LanguageList languages={languages} />
}
