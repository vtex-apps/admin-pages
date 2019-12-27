import { keys, map, splitEvery } from 'ramda'

import { Data, Message, Props, Variables } from './typings'

import messagesForDomainQuery from '../../queries/MessagesForDomain.graphql'

const MAX_COMPONENTS_PER_QUERY = 15

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

  const componentNamesToFetch = allComponentNames.filter(componentName => {
    const shouldFetchComponent = !fetchedKeys.has(componentName)

    return shouldFetchComponent
  })

  if (componentNamesToFetch.length === 0) {
    return cachedResult
  }

  const componentsBatch = splitEvery(
    MAX_COMPONENTS_PER_QUERY,
    componentNamesToFetch
  )

  const responses = map(
    batch =>
      client
        .query<Data, Variables>({
          fetchPolicy: 'network-only',
          query: messagesForDomainQuery,
          variables: {
            components: batch,
            domain,
            renderMajor,
          },
        })
        .then(res => {
          batch.forEach(componentName => {
            fetchedKeys.add(componentName)
          })

          return res
        }),
    componentsBatch
  )
  const messages = await reduceP(
    async (acc, response) => {
      try {
        const {
          data: { messages: batchMessages },
        } = await response
        return [...acc, ...batchMessages]
      } catch (e) {
        return acc
      }
    },
    [] as Message[],
    responses
  )

  const messagesInReactIntlFormat = messagesToReactIntlFormat(messages)
  cachedResult = { ...cachedResult, ...messagesInReactIntlFormat }

  return messagesInReactIntlFormat
}
