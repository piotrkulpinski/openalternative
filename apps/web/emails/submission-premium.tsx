import { type Tool, ToolStatus } from "@openalternative/db/client"
import { Text } from "@react-email/components"
import { EmailFeatureNudge } from "~/emails/components/feature-nudge"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/components/wrapper"

export type EmailProps = EmailWrapperProps & {
  tool: Tool
}

const EmailSubmissionPremium = ({ tool, ...props }: EmailProps) => {
  return (
    <EmailWrapper signature {...props}>
      <Text>Hey {tool.submitterName?.trim()}!</Text>

      {tool.isFeatured ? (
        tool.publishedAt && tool.status === ToolStatus.Published ? (
          <Text>
            Thanks for featuring {tool.name}, it should soon be displayed at a prominent place on
            our listings. If that's not the case, please clear your cache and refresh the page.
          </Text>
        ) : (
          <Text>
            Thanks for featuring {tool.name}, it will now be reviewed and added to our directory{" "}
            <strong>within 12 hours</strong>. If you want your tool published on a specific date,
            please let us know. We'll do our best to meet your request.
          </Text>
        )
      ) : (
        <>
          <Text>
            Thanks for submitting {tool.name}, it will now be reviewed and added to our directory{" "}
            <strong>within 24 hours</strong>. If you want your tool published on a specific date,
            please let us know. We'll do our best to meet your request.
          </Text>

          <EmailFeatureNudge tool={tool} showButton />
        </>
      )}
    </EmailWrapper>
  )
}

export default EmailSubmissionPremium
