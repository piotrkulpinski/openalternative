import { createCookie } from "@remix-run/node"

export type UserPrefs = {
  hideNewsletter?: boolean
}

export const userPrefs = createCookie("user-prefs", { maxAge: 2147483647 })
