import type { Tool } from "@openalternative/db/client"
import { Text } from "@react-email/components"
import type { Jsonify } from "inngest/helpers/jsonify"
import plur from "plur"
import { config } from "~/config"
import { EmailButton } from "~/emails/components/button"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"

type EmailProps = EmailWrapperProps & {
  monthsWaiting: number
  tool: Tool | Jsonify<Tool>
}

const EmailToolExpediteReminder = ({ tool, monthsWaiting, ...props }: EmailProps) => {
  return (
    <EmailWrapper signature {...props}>
      <Text>Hey {tool.submitterName?.trim()}!</Text>

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

      <EmailButton href={`${config.site.url}/submit/${tool.slug}?discountCode=EXTRA25`}>
        Publish {tool.name} within 24 hours
      </EmailButton>
    </EmailWrapper>
  )
}

export default EmailToolExpediteReminder
