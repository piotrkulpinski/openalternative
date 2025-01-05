import type { Tool } from "@openalternative/db/client"
import { Text } from "@react-email/components"
import type { Jsonify } from "inngest/helpers/jsonify"
import plur from "plur"
import { config } from "~/config"
import { EmailButton } from "~/emails/components/button"
import { EmailWrapper } from "~/emails/components/wrapper"

interface Props {
  to: string
  subject: string
  monthsWaiting: number
  tool: Tool | Jsonify<Tool>
}

export default function EmailToolExpediteReminder({ tool, monthsWaiting, ...props }: Props) {
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

      <EmailButton href={link}>Click here to expedite your listing</EmailButton>
    </EmailWrapper>
  )
}
