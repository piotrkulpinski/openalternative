import { formatNumber } from "@curiousleaf/utils"
import type { Tool } from "@openalternative/db/client"
import { Heading, Text } from "@react-email/components"
import { differenceInDays, format } from "date-fns"
import type { Jsonify } from "inngest/helpers/jsonify"
import { config } from "~/config"
import { EmailButton } from "~/emails/components/button"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"

type EmailProps = EmailWrapperProps & {
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

      <Text>
        Today is the <strong>last day</strong> of our special campaign to help reduce this waiting
        time:
      </Text>

      <Text className="text-green-500 font-semibold">
        We're offering a special <u>50% discount</u> for expedited listing with{" "}
        <u>only 10 spots left</u>! Get your tool published within 24 hours instead of waiting in
        line!
      </Text>

      <EmailButton href={`${config.site.url}/submit/${tool.slug}?discountCode=SPECIAL50`}>
        Publish {tool.name} - 10 spots left!
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
    </EmailWrapper>
  )
}

export default EmailToolExpediteDeal
