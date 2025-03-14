import type { Tool } from "@openalternative/db/client"
import { Text } from "@react-email/components"
import { addHours, differenceInDays, format, formatDistanceToNowStrict } from "date-fns"
import type { Jsonify } from "inngest/helpers/jsonify"
import { config } from "~/config"
import { EmailExpediteNudge } from "~/emails/components/expedite-nudge"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"

type EmailProps = EmailWrapperProps & {
  tool: Tool | Jsonify<Tool>
}

const EmailToolScheduled = ({ tool, ...props }: EmailProps) => {
  const publishedAt = addHours(tool.publishedAt || new Date(), 2)
  const isLongQueue = differenceInDays(publishedAt, new Date()) > 7
  const dateRelative = formatDistanceToNowStrict(publishedAt, { addSuffix: true })
  const dateFormatted = format(publishedAt, "MMMM do, yyyy")

  return (
    <EmailWrapper signature {...props}>
      <Text>Hey {tool.submitterName?.trim()}!</Text>

      <Text>
        Great news! Your submitted tool, <strong>{tool.name}</strong>, was{" "}
        <strong>accepted and scheduled</strong> for publication on {config.site.name}.
      </Text>

      {isLongQueue ? (
        <EmailExpediteNudge tool={tool}>
          on <strong>{dateFormatted}</strong>
        </EmailExpediteNudge>
      ) : (
        <Text>
          {tool.name} is scheduled to be added <strong>{dateRelative}</strong>.
        </Text>
      )}
    </EmailWrapper>
  )
}

export default EmailToolScheduled
