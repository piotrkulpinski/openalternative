import type { Prisma } from "@prisma/client"
import { MoveRightIcon } from "lucide-react"
import Link from "next/link"
import { H2 } from "~/components/common/heading"
import { ToolList } from "~/components/web/tools/tool-list"
import { Button } from "~/components/web/ui/button"
import type { LicenseOne } from "~/server/licenses/payloads"
import { findTools } from "~/server/tools/queries"

type LicenseToolListingProps = Prisma.ToolFindManyArgs & {
  license: LicenseOne
}

export const LicenseToolListing = async ({ license, ...args }: LicenseToolListingProps) => {
  const tools = await findTools(args)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <H2>{license.name} Licensed Software Examples</H2>

        <Button size="md" variant="secondary" suffix={<MoveRightIcon />} asChild>
          <Link href={`/licenses/${license.slug}/tools`}>View All Tools</Link>
        </Button>
      </div>

      <ToolList tools={tools} />
    </div>
  )
}
