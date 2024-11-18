import { createCookie } from "@remix-run/node"

export type UserPrefs = {
  hideNewsletter?: boolean
}

export const userPrefsCookie = createCookie("user-prefs", {
  maxAge: 2147483647,
})

export const getUserPrefs = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie")
  return ((await userPrefsCookie.parse(cookieHeader)) || {}) as UserPrefs
}
