import type { Tool } from "@openalternative/db/client"
import { Text } from "@react-email/components"
import type { Jsonify } from "inngest/helpers/jsonify"
import { config } from "~/config"
import { EmailButton } from "~/emails/components/button"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"
import { getQueueLength } from "~/lib/products"

export type EmailSubmissionProps = EmailWrapperProps & {
  tool?: Tool | Jsonify<Tool>
  queueLength?: number
}

const EmailSubmission = ({ tool, queueLength = 100, ...props }: EmailSubmissionProps) => {
  return (
    <EmailWrapper {...props}>
      <Text>Hey {tool?.submitterName}!</Text>

      <Text>Thanks for submitting {tool?.name}, it'll be reviewed shortly!</Text>

      {queueLength > 10 && (
        <>
          <Text>
            Due to the high volume of submissions we're currently receiving, there's a bit of a
            queue. {tool?.name} is scheduled to be added in approximately{" "}
            <strong className="whitespace-nowrap">{getQueueLength(queueLength)}</strong>. However,
            if you'd like to fast-track your submission, you have the option to skip the queue.
          </Text>

          <EmailButton href={`${config.site.url}/submit/${tool?.slug}`}>
            Publish {tool?.name} within 24 hours
          </EmailButton>
        </>
      )}
    </EmailWrapper>
  )
}

export default EmailSubmission
