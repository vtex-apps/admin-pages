import ApolloClient from 'apollo-client'
import { InjectedIntl } from 'react-intl'

export interface Props {
  runtime: RenderContext
  domain: string
  client: ApolloClient<unknown>
}

export interface Message {
  key: string
  message: string
}

export interface Data {
  messages: Message[]
}

export interface Variables {
  components: string[]
  domain: string
  renderMajor: number
}

export interface AvailableCulturesProps {
  client: ApolloClient<unknown>
  intl: InjectedIntl
}

export interface Languages {
  languages: {
    default: string
    supported: string[]
  }
}

export interface LabelledLocale {
  label: string
  value: string
}
