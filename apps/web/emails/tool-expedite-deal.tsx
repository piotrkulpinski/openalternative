import { formatNumber } from "@curiousleaf/utils"
import type { Tool } from "@openalternative/db/client"
import { Heading, Text } from "@react-email/components"
import { differenceInDays, format } from "date-fns"
import type { Jsonify } from "inngest/helpers/jsonify"
import { config } from "~/config"
import { EmailButton } from "~/emails/components/button"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"

export type EmailProps = EmailWrapperProps & {
  tool: Tool | Jsonify<Tool>
  queueLength?: number
}

const EmailToolExpediteDeal = ({ tool, queueLength = 100, ...props }: EmailProps) => {
  const dateFormatted = format(tool.publishedAt!, "MMMM do, yyyy")
  const waitingTime = differenceInDays(tool.publishedAt!, new Date())

  return (
    <EmailWrapper signature {...props}>
      <Text>Hey {tool.submitterName?.trim()}!</Text>

      <Text>
        Our waiting list has been growing rapidly lately, and currently, there are{" "}
        <strong className="whitespace-nowrap">{queueLength}</strong> tools waiting to be published
        on {config.site.name}.
      </Text>

      <Text>We want to reduce this waiting time, so we're running a special campaign today:</Text>

      <Text className="text-green-500 font-semibold">
        We're offering a special <u>50% discount</u> for the <u>first 25 people</u> in the waiting
        line, to expedite your listing and get it published within 24 hours!
      </Text>

      <EmailButton href={`${config.site.url}/submit/${tool.slug}?discountCode=SPECIAL50`}>
        Publish {tool.name} today!
      </EmailButton>

      <Heading as="h3">Why should you take the deal?</Heading>

      <Text>
        {config.site.name} currently receives over {formatNumber(config.stats.pageviews)} pageviews
        per month, and we're working hard to increase this number every day.{" "}
        <strong>{tool.name}</strong> is scheduled to be published on{" "}
        <strong>{dateFormatted}</strong>, which means you'll lose{" "}
        <strong>{formatNumber(waitingTime * (config.stats.pageviews / 30))} pageviews</strong> of
        potential exposure.
      </Text>

      <Text>
        This is the first (and probably last) time we're running this deal, so it's a great way to
        get your open-source tool in front of more people.
      </Text>
    </EmailWrapper>
  )
}

export default EmailToolExpediteDeal
