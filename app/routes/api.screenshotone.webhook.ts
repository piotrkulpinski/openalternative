import { LoaderFunctionArgs } from "@remix-run/node"

export const loader = ({ request }: LoaderFunctionArgs) => {
  console.log(request)
}
