import { SITE_NAME, SITE_TAGLINE } from "~/utils/constants"
import { Intro } from "~/components/Intro"
import { Prose } from "~/components/Prose"
import { Featured } from "~/components/Featured"
import { MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
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
    title: "About Us",
    description: `${SITE_NAME} is a community driven list of open source alternatives to proprietary software and applications.`,
  }

  return json({ meta })
}

export default function AboutPage() {
  const { meta } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Featured />

      <Prose>
        <h2>What is OpenAlternative?</h2>
        <p>
          <a href="https://openalternative.co" title={SITE_TAGLINE}>
            OpenAlternative
          </a>{" "}
          is a community driven list of open source alternatives to proprietary software and
          applications. The goal of the site is to be your first stop when researching for a new
          open source service to help you grow your business. It will help you find alternatives and
          reviews of the products you already use.
        </p>

        <h2>How did OpenAlternative get started?</h2>

        <p>
          The project started as a weekend project to learn a new technology and try something new
          and fun from scratch. It gained a lot of traction early on (
          <a href="https://kulp.in/launch" target="_blank" rel="noreferrer">
            100k unique visitors
          </a>{" "}
          in one week,{" "}
          <a
            href="https://news.ycombinator.com/item?id=39639386"
            target="_blank"
            rel="noreferrer nofollow"
          >
            #1 on Hacker News
          </a>
          ) so it was clear that there was a need for a site like this.
        </p>

        <p>
          I’ve always been a fan of open source software and I’ve always wanted to contribute to the
          community in some way. I thought that creating a list of open source alternatives to
          proprietary software and applications would be a great way to give back to the community.
        </p>

        <h2>Tools Used</h2>
        <ul>
          <li>
            <a href="https://remix.run" target="_blank" rel="noreferrer nofollow">
              Remix
            </a>
            - Web framework
          </li>
          <li>
            <a href="https://github.com" target="_blank" rel="noreferrer nofollow">
              GitHub
            </a>
            - Repository data
          </li>
          <li>
            <a
              href="https://kulp.in/airtable"
              target="_blank"
              title="Screenshot API"
              rel="noreferrer nofollow"
            >
              Airtable
            </a>
            - Database
          </li>
          <li>
            <a
              href="https://kulp.in/screenstudio"
              target="_blank"
              title="Screen recorder for Mac"
              rel="noreferrer"
            >
              Screen Studio
            </a>
            - Screen recording for marketing videos
          </li>
          <li>
            <a
              href="https://kulp.in/screenshotone"
              target="_blank"
              title="Screenshot API"
              rel="noreferrer"
            >
              ScreenshotOne
            </a>
            - Generating website screenshots
          </li>
        </ul>

        <h2>Contribute</h2>
        <p>
          If you have any suggestions for open source alternatives to proprietary software and
          applications, feel free to contribute to the list. You can also contribute by suggesting
          new categories or improving the website. The source code is available on{" "}
          <a
            href="https://github.com/piotrkulpinski/openalternative"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p>

        <p>
          Enjoy and feel free to contribute!
          <br />–{" "}
          <a href="https://twitter.com/piotrkulpinski" target="_blank" rel="noreferrer">
            Piotr Kulpinski
          </a>
        </p>
      </Prose>
    </>
  )
}
