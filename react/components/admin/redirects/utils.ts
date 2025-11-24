export const slugifyRedirectQueryString = (data: string) =>
  data.replace(/=/g, '/').replace(/&/g, ';')

export const parseRedirectQueryString = (data: string) =>
  data.replace(/\//g, '=').replace(/;/g, '&')
