import { Prose } from "@curiousleaf/design"
import { Metadata } from "next"
import { cache } from "react"
import { Intro } from "~/components/Intro"
import { config } from "~/config"
import { parseMetadata } from "~/utils/metadata"

// Getters
const getMetadata = cache((metadata?: Metadata) => ({
  ...metadata,
  title: "About Us",
  description: `${config.title} is a community driven list of open source alternatives to proprietary software and applications.`,
}))

// Dynamic Metadata
export const generateMetadata = async ({}): Promise<Metadata> => {
  const url = "/about"

  const metadata = getMetadata({
    alternates: { canonical: url },
    openGraph: { url },
  })

  return parseMetadata(metadata)
}

// Component
export default async function About() {
  const metadata = getMetadata()

  return (
    <>
      <Intro title={metadata.title} description={metadata.description} />

      <Prose>
        <h2>Hi, Piotr here 👋</h2>

        <p>
          I was collecting nice open-source companies for quite some time now. Mostly to take some
          inspiration and learn from their code.
        </p>

        <p>
          Last week, I though it would be fun to learn this Astro thing everyone&apos;s talking
          about. So I thought building a directory website out of this collection was pretty good
          idea.
        </p>

        <p>
          After 2 days of building, OpenAlternative was born. It&apos;s a community driven list of
          open source alternatives to proprietary software and applications.
        </p>

        <p>Enjoy and feel free to contribute!</p>

        <h2>Tools Used</h2>
        <h3>Frontend</h3>
        <p>
          For the frontend, I initially used{" "}
          <a href="https://astro.build/" target="_blank">
            Astro
          </a>
          . It&apos;s a new static site generator that&apos;s really fast and fun to work with.
          Working with Astro feels like working with a modern framework like React or Vue, but
          it&apos;s actually a static site generator.
        </p>
        <p>
          A great addition to Astro is the ViewTransitions API support. It&apos;s a really cool
          feature that allows you to add page transitions to your website with just a few lines of
          code.
        </p>
        <p>After a while, I switched to Next.js for better SEO and performance.</p>

        <p>
          I also used{" "}
          <a href="https://tailwindcss.com/" target="_blank">
            Tailwind CSS
          </a>{" "}
          for styling. It&apos;s a utility-first CSS framework that&apos;s really easy to use and
          makes building websites a breeze.
        </p>

        <h3>Backend</h3>
        <p>
          For the database, I used{" "}
          <a href="https://airtable.com" target="_blank">
            Airtable
          </a>
          . It&apos;s a really cool tool that allows you to create databases with a really nice UI.
          It also has a really nice API that makes it easy to work with.
        </p>

        <p>
          Screenshots are generated automatically with{" "}
          <a href="https://screenshotone.com" target="_blank" title="Screenshot API">
            ScreenshotOne
          </a>
          . Highly recommended service for generating screenshots of websites.
        </p>

        <h2>Contribute</h2>
        <p>
          If you have any suggestions for open source alternatives to proprietary software and
          applications, feel free to contribute to the list. You can also contribute by adding new
          categories or improving the website. The source code is available on{" "}
          <a href="https://github.com/piotrkulpinski/openalternative" target="_blank">
            GitHub
          </a>
          .
        </p>
      </Prose>
    </>
  )
}
