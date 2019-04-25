import ApolloClient from 'apollo-client'
import { keys, map, reduce, splitEvery } from 'ramda'

import messagesForDomainQuery from '../queries/MessagesForDomain.graphql'

const MAX_COMPONENTES_PER_QUERY = 100

interface Props {
  runtime: RenderContext
  domain: string
  client: ApolloClient<any>
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

const messagesToReactIntlFormat = (messages: Message[]) =>
  reduce(
    (acc, { key, message }) => ({ ...acc, [key]: message }),
    {} as Record<string, string>,
    messages
  )

const reduceP = async <T, K>(fn: (acc: K, item: T) => Promise<K>, intialValue: K, list: T[]) => {
  let acc = intialValue
  for(const item of list) {
    acc = await fn(acc, item)
  }
  return acc
}

export const editorMessagesFromRuntime = async ({
  client,
  domain,
  runtime,
}: Props) => {
  const { components, renderMajor } = runtime
  const componentNames = keys(components)
  const componentsBatch = splitEvery(MAX_COMPONENTES_PER_QUERY, componentNames)
  const responses = map(
    (batch) => client.query<Data, Variables>({
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
      console.log('reducing', batchMessages)
      return [...acc, ...batchMessages]
    },
    [] as Message[],
    responses
  )
  return messagesToReactIntlFormat(messages)
}
