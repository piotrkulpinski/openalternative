import { redirect } from "@remix-run/node"

export const loader = () => {
  return redirect("/?openalternative[sortBy]=openalternative_published_desc")
}
