import type { ComponentProps } from "react"
import { EmptyList } from "~/components/web/empty-list"
import { LanguageCard, LanguageCardSkeleton } from "~/components/web/languages/language-card"
import { Grid } from "~/components/web/ui/grid"
import type { LanguageMany } from "~/server/web/languages/payloads"
import { cx } from "~/utils/cva"

type LanguageListProps = ComponentProps<typeof Grid> & {
  languages: LanguageMany[]
}

const LanguageList = ({ languages, className, ...props }: LanguageListProps) => {
  return (
    <Grid className={cx("md:gap-8", className)} {...props}>
      {languages.map(language => (
        <LanguageCard key={language.slug} language={language} />
      ))}

      {!languages.length && <EmptyList>No languages found.</EmptyList>}
    </Grid>
  )
}

const LanguageListSkeleton = () => {
  return (
    <Grid className="md:gap-8">
      {[...Array(24)].map((_, index) => (
        <LanguageCardSkeleton key={index} />
      ))}
    </Grid>
  )
}

export { LanguageList, LanguageListSkeleton }
