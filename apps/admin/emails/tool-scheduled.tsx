import type { Tool } from "@prisma/client"
import { Text } from "@react-email/components"
import { differenceInDays, formatDistanceToNowStrict } from "date-fns"
import type { Jsonify } from "inngest/helpers/jsonify"
import { config } from "~/config"
import { EmailButton } from "~/emails/_components/button"
import { EmailFeatureNudge } from "~/emails/_components/feature-nudge"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/_components/wrapper"

export type EmailToolScheduledProps = EmailWrapperProps & {
  tool?: Tool | Jsonify<Tool>
}

const EmailToolScheduled = ({ tool, ...props }: EmailToolScheduledProps) => {
  const publishedAt = tool?.publishedAt || new Date()
  const isLongQueue = differenceInDays(new Date(), publishedAt) > 1
  const timeUntilPublished = formatDistanceToNowStrict(publishedAt, { addSuffix: true })

  return (
    <EmailWrapper {...props}>
      <Text>Hey {tool?.submitterName}!</Text>

      <Text>
        Great news! Your submitted tool, <strong>{tool?.name}</strong>, was{" "}
        <strong>accepted and scheduled</strong> for publication on {config.site.name}.
      </Text>

      {isLongQueue ? (
        <>
          <Text>
            Due to the high volume of submissions we're currently receiving, there's a bit of a
            queue. {tool?.name} is scheduled to be added <strong>{timeUntilPublished}</strong>.
            However, if you'd like to fast-track your submission, you have the option to skip the
            queue.
          </Text>

          <EmailButton href={`${config.site.url}/submit/${tool?.slug}`}>
            Publish {tool?.name} within 24 hours
          </EmailButton>
        </>
      ) : (
        <Text>
          {tool?.name} is scheduled to be added <strong>{timeUntilPublished}</strong>.
        </Text>
      )}

      <EmailFeatureNudge tool={tool} showButton={!isLongQueue} />
    </EmailWrapper>
  )
}

export default EmailToolScheduled
