import { Intro } from "~/components/Intro"
import { Prose } from "~/components/Prose"
import { MetaFunction, json } from "@remix-run/node"
import { useFetcher, useLoaderData, useLocation } from "@remix-run/react"
import { Input } from "~/components/forms/Input"
import { Label } from "~/components/forms/Label"
import { Button } from "~/components/Button"
import { SITE_NAME } from "~/utils/constants"
import { action } from "./api.submit"
import { TextArea } from "~/components/forms/TextArea"
import { useId } from "react"
import { getMetaTags } from "~/utils/meta"

export const meta: MetaFunction<typeof loader> = ({ matches, data }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = () => {
  const meta = {
    title: "Submit your Open Source Software",
    description: `Help us grow the list of open source alternatives to proprietary software. Contribute to ${SITE_NAME} by submitting a new open source alternative.`,
  }

  return json({ meta })
}

export default function SubmitPage() {
  const { meta } = useLoaderData<typeof loader>()
  const id = useId()
  const { key } = useLocation()
  const { data, state, Form } = useFetcher<typeof action>({ key: `${id}-${key}` })

  return (
    <>
      <Intro {...meta} />

      {data?.type !== "success" && (
        <div className="flex flex-col-reverse items-start gap-12 lg:flex-row">
          <Form
            method="POST"
            action="/api/submit"
            className="grid-auto-fill-xs grid w-full max-w-xl gap-6"
            noValidate
          >
            <div className="flex flex-col gap-1">
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

              {data?.error?.name && (
                <p className="text-xs text-red-600">{data.error.name?._errors[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
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

              {data?.error?.website && (
                <p className="text-xs text-red-600">{data.error.website?._errors[0]}</p>
              )}
            </div>

            <div className="col-span-full flex flex-col gap-1">
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

              {data?.error?.repository && (
                <p className="text-xs text-red-600">{data.error.repository?._errors[0]}</p>
              )}
            </div>

            <div className="col-span-full flex flex-col gap-1">
              <Label htmlFor="description" isRequired>
                Description:
              </Label>

              <TextArea
                name="description"
                id="description"
                rows={3}
                placeholder="A platform that helps engineers build better products"
                required
              />

              {data?.error?.description && (
                <p className="text-xs text-red-600">{data.error.description?._errors[0]}</p>
              )}
            </div>

            <div>
              <Button isPending={state !== "idle"} className="min-w-32">
                Submit
              </Button>
            </div>
          </Form>

          <Prose className="flex-1 text-pretty text-sm/normal">
            <p>Please make sure the software you’re submitting meets the following criteria:</p>

            <ul>
              <li>It’s open source</li>
              <li>It’s free to use or can be self-hosted</li>
              <li>It’s actively maintained</li>
              <li>It’s a good alternative to a proprietary software</li>
            </ul>
          </Prose>
        </div>
      )}

      {data?.type === "success" && <p className="text-base text-green-600">{data.message}</p>}
    </>
  )
}
