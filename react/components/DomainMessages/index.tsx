// This file is .tsx because otherwise the babel plugin for messages doesn't work.
import ApolloClient from 'apollo-client'
import { concat, keys, map, splitEvery } from 'ramda'

import { InjectedIntl } from 'react-intl'
import languagesQuery from '../../queries/Languages.graphql'
import messagesForDomainQuery from '../../queries/MessagesForDomain.graphql'
import messages from './cultureMessages'

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
  messages.reduce((acc, { key, message }) => ({ ...acc, [key]: message }), {})

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

let cachedResult: Record<string, string> = {}
const fetchedKeys = new Set()

export const editorMessagesFromRuntime = async ({
  client,
  domain,
  runtime,
}: Props) => {
  const { components, renderMajor } = runtime
  const allComponentNames = keys(components)
  const componentNames = new Set<string>()

  allComponentNames.forEach(componentName => {
    if (!fetchedKeys.has(componentName)) {
      componentNames.add(componentName)
      fetchedKeys.add(componentName)
    }
  })

  if (componentNames.size === 0) {
    return cachedResult
  }

  const componentsBatch = splitEvery(
    MAX_COMPONENTES_PER_QUERY,
    Array.from<string>(componentNames)
  )

  const responses = map(
    batch =>
      client.query<Data, Variables>({
        fetchPolicy: 'network-only',
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

  const messagesInReactIntlFormat = messagesToReactIntlFormat(messages)
  cachedResult = { ...cachedResult, ...messagesInReactIntlFormat }

  return messagesInReactIntlFormat
}

function isValidLang(key: string): key is keyof typeof messages {
  return Object.prototype.hasOwnProperty.call(messages, key)
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
        const i18nId = isValidLang(lang)
          ? messages[lang] && messages[lang].id
          : `admin/pages.editor.locale.${lang}`

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
