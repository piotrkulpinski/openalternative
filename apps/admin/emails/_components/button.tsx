import { Button, type ButtonProps, Section } from "@react-email/components"

export const EmailButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Section className="my-8 first:mt-0 last:mb-0">
      <Button
        className="rounded-md bg-neutral-950 px-5 py-2 text-center text-sm font-medium text-white no-underline"
        {...props}
      >
        {children}
      </Button>
    </Section>
  )
}
