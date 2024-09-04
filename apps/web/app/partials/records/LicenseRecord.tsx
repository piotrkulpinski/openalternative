import type { SerializeFrom } from "@remix-run/node"
import { CardSimple } from "apps/web/app/components/CardSimple"
import type { LicenseMany } from "apps/web/app/services.server/api"
import plur from "plur"
import type { HTMLAttributes } from "react"

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
