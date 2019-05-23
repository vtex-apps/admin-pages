import { InjectedIntl } from 'react-intl'

export interface GetTextFromContextArgs {
  context: PageContext
  intl: InjectedIntl
  isSitewide: boolean
  path: string
}
