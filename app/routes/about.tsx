import { SITE_NAME } from "~/utils/constants"
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
        <h2>Hi, Piotr here 👋</h2>

        <p>
          I was collecting nice open-source companies for quite some time now. Mostly to take some
          inspiration and learn from their code.
        </p>

        <p>
          Last week, I though it would be fun to learn this Astro thing everyone’s talking about. So
          I thought building a directory website out of this collection was pretty good idea.
        </p>

        <p>
          After 2 days of building, OpenAlternative was born. It’s a community driven list of open
          source alternatives to proprietary software and applications.
        </p>

        <p>Enjoy and feel free to contribute!</p>

        <h2>Tools Used</h2>
        <h3>Frontend</h3>
        <p>
          For the frontend, I used{" "}
          <a href="https://astro.build/" target="_blank" rel="noreferrer">
            Astro
          </a>
          . It’s a new static site generator that’s really fast and fun to work with. Working with
          Astro feels like working with a modern framework like React or Vue, but it’s actually a
          static site generator.
        </p>
        <p>
          A great addition to Astro is the ViewTransitions API support. It’s a really cool feature
          that allows you to add page transitions to your website with just a few lines of code.
        </p>

        <p>
          I also used{" "}
          <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer">
            Tailwind CSS
          </a>{" "}
          for styling. It’s a utility-first CSS framework that’s really easy to use and makes
          building websites a breeze.
        </p>

        <h3>Backend</h3>
        <p>
          For the database, I used{" "}
          <a href="https://kulp.in/airtable" target="_blank" rel="noreferrer">
            Airtable
          </a>
          . It’s a really cool tool that allows you to create databases with a really nice UI. It
          also has a really nice API that makes it easy to work with.
        </p>

        <p>
          Screenshots are generated automatically with{" "}
          <a
            href="https://kulp.in/screenshotone"
            target="_blank"
            title="Screenshot API"
            rel="noreferrer"
          >
            ScreenshotOne
          </a>
          . Highly recommended service for generating screenshots of websites.
        </p>

        <h2>Contribute</h2>
        <p>
          If you have any suggestions for open source alternatives to proprietary software and
          applications, feel free to contribute to the list. You can also contribute by adding new
          categories or improving the website. The source code is available on{" "}
          <a
            href="https://github.com/piotrkulpinski/openalternative"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </Prose>
    </>
  )
}
