import type { Tool } from "@prisma/client"
import { Text } from "@react-email/components"
import type { Jsonify } from "inngest/helpers/jsonify"
import { EmailFeatureNudge } from "~/emails/_components/feature-nudge"
import { EmailWrapper, type EmailWrapperProps } from "~/emails/_components/wrapper"

export type EmailSubmissionExpeditedProps = EmailWrapperProps & {
  tool?: Tool | Jsonify<Tool>
}

const EmailSubmissionExpedited = ({ tool, ...props }: EmailSubmissionExpeditedProps) => {
  return (
    <EmailWrapper {...props}>
      <Text>Hey {tool?.submitterName}!</Text>

      <Text>
        Thanks for submitting {tool?.name}, it will now be reviewed and added to our directory{" "}
        <strong>within 24 hours</strong>. If you want your tool published on a specific date, please
        let us know. We'll do our best to meet your request.
      </Text>

      <EmailFeatureNudge tool={tool} showButton />
    </EmailWrapper>
  )
}

export default EmailSubmissionExpedited
