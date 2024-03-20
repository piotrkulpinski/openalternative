import type { MetaFunction } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { CardSimple } from "~/components/CardSimple"
import { Intro } from "~/components/Intro"
import { languageManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async () => {
  const languages = await prisma.language.findMany({
    orderBy: { name: "asc" },
    include: languageManyPayload,
  })

  return typedjson({ languages })
}

export default function Index() {
  const { languages } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <Intro
        title="Most Popular Languages used in Open Source Software"
        description="Browse top languages to find your best Open Source software options."
      />

      <div className="grid grid-cols-3 gap-8">
        {languages.map((language) => (
          <CardSimple
            key={language.id}
            to={`/languages/${language.slug}`}
            label={language.name}
            caption={`${language.tools.length} tools`}
          />
        ))}
      </div>
    </>
  )
}
