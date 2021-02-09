import { AlertProps } from 'vtex.styleguide'

export interface RedirectsQuery {
  redirect: {
    list: Redirect[]
    numberOfEntries: number
  }
}

export interface AlertState {
  type: AlertProps['type']
  message: string
  meta?: {
    failedRedirects: Redirect[]
    mutation: (data: Redirect[]) => Promise<void>
    isSave: boolean
  }
  action?: {
    label: string
  }
}
