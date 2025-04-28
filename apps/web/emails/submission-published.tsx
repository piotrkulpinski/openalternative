import type { Tool } from "@openalternative/db/client"
import { Text } from "@react-email/components"
import { config } from "~/config"
import { EmailButton } from "~/emails/components/button"
import { EmailFeatureNudge } from "~/emails/components/feature-nudge"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"

export type EmailProps = EmailWrapperProps & {
  tool: Tool
}

const EmailSubmissionPublished = ({ tool, ...props }: EmailProps) => {
  return (
    <EmailWrapper signature {...props}>
      <Text>Hey {tool.submitterName?.trim()}!</Text>

      <Text>
        Great news! Your submitted tool,{" "}
        <strong>
          {tool.name}, is now live on {config.site.name}
        </strong>
        . Thank you for sharing this awesome resource with our community!
      </Text>

      <Text>
        We'd love it if you could spread the word. A quick post on your favorite social platform or
        community about {tool.name} would mean a lot to us. It helps other people discover cool
        tools like yours!
      </Text>

      <EmailButton href={`${config.site.url}/${tool.slug}`}>
        Check out {tool.name} on {config.site.name}
      </EmailButton>

      <EmailFeatureNudge tool={tool} />
    </EmailWrapper>
  )
}

export default EmailSubmissionPublished
