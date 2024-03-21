import { Intro } from "~/components/Intro"
import { Prose } from "~/components/Prose"
import { MetaFunction } from "@remix-run/node"
import { useFetcher } from "@remix-run/react"
import { Input } from "~/components/Input"
import { Label } from "~/components/Label"
import { Button } from "~/components/Button"
import { SITE_NAME } from "~/utils/constants"
import { action } from "./api.submit"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export default function SubmitPage() {
  const { data, state, Form } = useFetcher<typeof action>()

  return (
    <>
      <Intro
        title="Submit your Open Source Software"
        description={`Help us grow the list of open source alternatives to proprietary software. Contribute to ${SITE_NAME} by submitting a new open source alternative.`}
      />

      <Prose className="text-pretty text-sm/normal">
        <h3>Submission Checklist:</h3>

        <p>
          Please make sure the software you’re submitting meets the following criteria before
          submitting:
        </p>

        <ul>
          <li>It’s open source</li>
          <li>It’s free to use or can be self-hosted</li>
          <li>It’s actively maintained</li>
          <li>It’s a good alternative to a proprietary software</li>
        </ul>

        {data?.type !== "success" && (
          <Form
            method="POST"
            action="/api/submit"
            className="not-prose grid-auto-fill-xs mt-12 grid gap-6"
            noValidate
          >
            <div>
              <Label htmlFor="name" isRequired>
                Name:
              </Label>

              <Input
                type="text"
                name="name"
                id="name"
                placeholder="PostHog"
                data-1p-ignore
                required
              />

              {data?.type === "error" && (
                <p className="mt-1 text-xs text-red-600">{data.error.name?._errors[0]}</p>
              )}
            </div>

            <div>
              <Label htmlFor="website" isRequired>
                Website:
              </Label>

              <Input
                type="url"
                name="website"
                id="website"
                placeholder="https://posthog.com"
                required
              />

              {data?.type === "error" && (
                <p className="mt-1 text-xs text-red-600">{data.error.website?._errors[0]}</p>
              )}
            </div>

            <div className="col-span-full">
              <Label htmlFor="repository" isRequired>
                Repository:
              </Label>

              <Input
                type="url"
                name="repository"
                id="repository"
                placeholder="https://github.com/posthog/posthog"
                required
              />

              {data?.type === "error" && (
                <p className="mt-1 text-xs text-red-600">{data.error.repository?._errors[0]}</p>
              )}
            </div>

            <div className="col-span-full">
              <Label htmlFor="description" isRequired>
                Description:
              </Label>

              <Input
                type="text"
                name="description"
                id="description"
                placeholder="A platform that helps engineers build better products"
                required
              />

              {data?.type === "error" && (
                <p className="mt-1 text-xs text-red-600">{data.error.description?._errors[0]}</p>
              )}
            </div>

            <div>
              <Button isPending={state !== "idle"} className="min-w-32">
                Submit
              </Button>
            </div>
          </Form>
        )}

        {data?.type === "success" && (
          <p className="mt-8 text-base text-green-600">{data.message}</p>
        )}
      </Prose>
    </>
  )
}
