import {
  Body,
  Container,
  type ContainerProps,
  Head,
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
  preview?: string
  signature?: boolean
}

export const EmailWrapper = ({ to, signature, preview, children }: EmailWrapperProps) => {
  return (
    <Html>
      <Head />
      {preview && <Preview>{preview}</Preview>}

      <Tailwind>
        <Body className="mx-auto my-auto bg-background font-sans">
          <Container className="w-full max-w-[580px] mx-auto px-10">
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

            {signature && (
              <Text>
                Best,
                <br />
                <Link href="https://x.com/piotrkulpinski" className="underline text-black">
                  Piotr
                </Link>{" "}
                from {config.site.name}
              </Text>
            )}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
