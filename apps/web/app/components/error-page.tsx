import { Link, isRouteErrorResponse, useLocation, useRouteError } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Intro } from "~/components/ui/intro"

export const ErrorPage = () => {
  const error = useRouteError()
  const { pathname } = useLocation()

  const response: { title: string; description: string; stack?: string } = {
    title: "Unknown Error",
    description: "An unknown error occurred.",
    stack: undefined,
  }

  if (isRouteErrorResponse(error)) {
    response.title = `${error.status} ${error.statusText}`
    response.description =
      error.status === 404
        ? `We're sorry, but the page "${pathname}" could not be found. You may have mistyped the address or the page may have moved.`
        : error.data
  } else if (error instanceof Error) {
    response.title = `An error occurred: ${error.name}`
    response.description = error.message
    response.stack = error.stack
  }

  return (
    <Intro title={response.title} description={response.description} className="w-full">
      {response.stack && (
        <pre className="text-xs text-red-500 mt-4 overflow-x-auto w-full">{response.stack}</pre>
      )}

      <Button size="lg" variant="primary" className="mt-4" asChild>
        <Link to="/">Go back home</Link>
      </Button>
    </Intro>
  )
}
