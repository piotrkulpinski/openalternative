import type { Tool } from "@prisma/client"
import { Text } from "@react-email/components"
import { differenceInWeeks, subDays } from "date-fns"
import type { Jsonify } from "inngest/helpers/jsonify"
import plur from "plur"
import { config } from "~/config"
import { EmailButton } from "~/emails/_components/button"
import { EmailFeatureNudge } from "~/emails/_components/feature-nudge"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/_components/wrapper"

export type EmailSubmissionProps = EmailWrapperProps & {
  tool?: Tool | Jsonify<Tool>
  queueDays?: number
}

const EmailSubmission = ({ tool, queueDays = 100, ...props }: EmailSubmissionProps) => {
  const queueWeeks = differenceInWeeks(new Date(), subDays(new Date(), queueDays))
  const queueText = `${queueWeeks} ${plur("week", queueWeeks)}`

  return (
    <EmailWrapper {...props}>
      <Text>Hey {tool?.submitterName}!</Text>

      <Text>Thanks for submitting {tool?.name}, it'll be reviewed shortly!</Text>

      {queueWeeks > 0 && (
        <>
          <Text>
            Due to the high volume of submissions we're currently receiving, there's a bit of a
            queue. {tool?.name} is scheduled to be added in approximately{" "}
            <strong className="whitespace-nowrap">{queueText}</strong>. However, if you'd like to
            fast-track your submission, you have the option to skip the queue.
          </Text>

          <EmailButton href={`${config.site.url}/submit/${tool?.slug}`}>
            Publish {tool?.name} within 24 hours
          </EmailButton>
        </>
      )}

      <EmailFeatureNudge tool={tool} />
    </EmailWrapper>
  )
}

export default EmailSubmission
