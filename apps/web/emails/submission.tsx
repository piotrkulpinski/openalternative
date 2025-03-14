import type { Tool } from "@openalternative/db/client"
import { Text } from "@react-email/components"
import type { Jsonify } from "inngest/helpers/jsonify"
import { EmailExpediteNudge } from "~/emails/components/expedite-nudge"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"
import { getQueueLength } from "~/lib/products"

type EmailProps = EmailWrapperProps & {
  tool: Tool | Jsonify<Tool>
  queueLength?: number
}

const EmailSubmission = ({ tool, queueLength = 100, ...props }: EmailProps) => {
  return (
    <EmailWrapper signature {...props}>
      <Text>Hey {tool.submitterName?.trim()}!</Text>

      <Text>Thanks for submitting {tool.name}, it'll be reviewed shortly!</Text>

      {queueLength > 10 && (
        <EmailExpediteNudge tool={tool}>
          in approximately <strong>{getQueueLength(queueLength)}</strong>
        </EmailExpediteNudge>
      )}
    </EmailWrapper>
  )
}

export default EmailSubmission
