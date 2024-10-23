import { createCookie } from "@remix-run/node"

export type UserPrefs = {
  hideNewsletter?: boolean
}

export const userPrefs = createCookie("user-prefs", {
  maxAge: 2147483647,
})

export const getUserPrefs = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie")
  return ((await userPrefs.parse(cookieHeader)) || {}) as UserPrefs
}
