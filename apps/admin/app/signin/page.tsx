import { redirect } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { auth, signIn } from "~/services/auth"

export default async function LoginPage() {
  const session = await auth()

  if (session?.user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex justify-center items-start p-8 bg-muted md:items-center">
      <Card className="w-full max-w-xs">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>

        <CardFooter>
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/" })
            }}
            className="w-full"
          >
            <Button className="w-full">Sign in with Google</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
