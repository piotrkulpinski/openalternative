import type { Tool } from "@openalternative/db/client"
import { Text } from "@react-email/components"
import type { Jsonify } from "inngest/helpers/jsonify"
import plur from "plur"
import { config } from "~/config"
import { EmailButton } from "~/emails/components/button"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"

export type EmailProps = EmailWrapperProps & {
  monthsWaiting: number
  tool: Tool | Jsonify<Tool>
}

export default function EmailToolExpediteReminder({ tool, monthsWaiting, ...props }: EmailProps) {
  const link = `${config.site.url}/submit/${tool?.slug}`

  return (
    <EmailWrapper {...props}>
      <Text>Hey {tool?.submitterName}!</Text>

      <Text>
        It's been {monthsWaiting} {plur("month", monthsWaiting)} since you submitted {tool.name} to{" "}
        {config.site.name}.
      </Text>

      <Text>
        Currently, your listing is in our review queue. However, you can skip the line and get
        featured immediately by choosing one of our expedited listing options:
      </Text>

      <ul>
        <li>⚡ Express Review - Skip the queue and get published within 24 hours</li>
        <li>⭐️ Featured Listing - Premium placement and immediate publication</li>
      </ul>

      {monthsWaiting > 1 && (
        <Text className="text-green-500">
          Don't miss out on our special offer! Use coupon code <strong>EXTRA25</strong> for a 25%
          discount on your expedited listing option.
        </Text>
      )}

      <EmailButton href={link}>Click here to expedite your listing</EmailButton>
    </EmailWrapper>
  )
}
