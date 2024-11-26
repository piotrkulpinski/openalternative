import {
  Body,
  Container,
  type ContainerProps,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components"
import { config } from "~/config"

export type EmailWrapperProps = ContainerProps & {
  to: string
  subject: string
}

export const EmailWrapper = ({ to, subject, children, ...props }: EmailWrapperProps) => {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>

      <Tailwind>
        <Body className="mx-auto my-auto bg-background font-sans">
          <Container className="w-full max-w-[580px] mx-auto px-10" {...props}>
            <Link href={config.site.url} className="inline-block mt-6 mb-2">
              <Img
                src={`${config.site.url}/logo.svg`}
                alt={`${config.site.name} Logo`}
                width="572"
                height="91"
                className="h-6 w-auto"
              />
            </Link>

            {children}

            <Hr />

            <Text className="text-xs/normal text-gray-500">
              This email was intended for <span className="text-foreground">{to}</span>. If you were
              not expecting this email, you can ignore it. If you are concerned about your accounts
              safety, please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
