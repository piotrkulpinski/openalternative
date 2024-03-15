export const convertTextToLink = (haystack: string, needle: string | null, url: string | null) => {
  if (!needle || !url) {
    return haystack
  }

  const template = `<a href="${url}" target="_blank" rel="noopener noreferrer nofollow">${needle}</a>`

  return haystack.replace(needle, template)
}
