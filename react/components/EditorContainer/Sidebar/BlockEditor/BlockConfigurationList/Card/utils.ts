import { GetGenericContextArgs } from './typings'

export const getGenericContext = ({
  context,
  isSitewide,
}: GetGenericContextArgs) => {
  if (isSitewide) {
    return 'sitewide'
  }

  if (context.id === '*') {
    return 'template'
  }

  return 'page'
}
