import ApolloClient from 'apollo-client'
import { concat, keys, map, reduce, splitEvery } from 'ramda'

import { defineMessages, InjectedIntl } from 'react-intl'
import languagesQuery from '../queries/Languages.graphql'
import messagesForDomainQuery from '../queries/MessagesForDomain.graphql'

const MAX_COMPONENTES_PER_QUERY = 100
// TODO: Remove this when messages solve this case
const DEFAULT_LANGUAGES = ['en-US', 'pt-BR', 'es-AR']

interface Props {
  runtime: RenderContext
  domain: string
  client: ApolloClient<unknown>
}

interface AvailableCulturesProps {
  client: ApolloClient<unknown>
  intl: InjectedIntl
}

interface Message {
  key: string
  message: string
}

interface Data {
  messages: Message[]
}

interface Variables {
  components: string[]
  domain: string
  renderMajor: number
}

interface Languages {
  languages: {
    default: string
    supported: string[]
  }
}

export interface LabelledLocale {
  label: string
  value: string
}

const messagesToReactIntlFormat = (messages: Message[]) =>
  reduce(
    (acc, { key, message }) => ({ ...acc, [key]: message }),
    {} as Record<string, string>,
    messages
  )

const reduceP = async <T, K>(
  fn: (acc: K, item: T) => Promise<K>,
  intialValue: K,
  list: T[]
) => {
  let acc = intialValue
  for (const item of list) {
    acc = await fn(acc, item)
  }
  return acc
}

export const editorMessagesFromRuntime = async ({
  client,
  domain,
  runtime,
}: Props) => {
  const {
    components,
    renderMajor,
    route: { path },
  } = runtime
  const componentNames = keys(components)
  const componentsBatch = splitEvery(MAX_COMPONENTES_PER_QUERY, componentNames)
  const responses = map(
    batch =>
      client.query<Data, Variables>({
        query: messagesForDomainQuery,
        variables: {
          components: batch,
          domain,
          renderMajor,
        },
      }),
    componentsBatch
  )
  const messages = await reduceP(
    async (acc, response) => {
      const {
        data: { messages: batchMessages },
      } = await response
      return [...acc, ...batchMessages]
    },
    [] as Message[],
    responses
  )
  return messagesToReactIntlFormat(messages)
}

export const getAvailableCultures = async ({
  client,
  intl,
}: AvailableCulturesProps) => {
  const {
    data: { languages },
  } = await client.query<Languages, Variables>({
    query: languagesQuery,
  })

  let { supported } = languages
  supported = Array.from(new Set(concat(supported, DEFAULT_LANGUAGES)))

  return supported
    .reduce(
      (acc, locale) => {
        const [lang, country] = locale.split('-')
        if (!lang || !country) {
          return acc
        }
        const i18nId = `admin/pages.editor.locale.${lang}`

        return [
          ...acc,
          {
            label: `${intl.formatMessage({ id: i18nId })} (${locale})`,
            value: locale,
          },
        ]
      },
      [] as LabelledLocale[]
    )
    .sort((a: LabelledLocale, b: LabelledLocale) =>
      a.label.localeCompare(b.label)
    )
}
