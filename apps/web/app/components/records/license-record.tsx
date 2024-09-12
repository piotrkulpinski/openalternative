import type { SerializeFrom } from "@remix-run/node"
import plur from "plur"
import type { HTMLAttributes } from "react"
import { CardSimple } from "~/components/ui/card-simple"
import type { LicenseMany } from "~/services.server/api"

type LicenseRecordProps = HTMLAttributes<HTMLElement> & {
  license: SerializeFrom<LicenseMany>
}

export const LicenseRecord = ({ license, ...props }: LicenseRecordProps) => {
  return (
    <CardSimple
      to={`/licenses/${license.slug}`}
      label={license.name}
      caption={`${license._count.tools} ${plur("tool", license._count.tools)}`}
      {...props}
    />
  )
}
