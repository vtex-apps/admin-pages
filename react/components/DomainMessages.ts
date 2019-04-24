import ApolloClient from 'apollo-client'
import { keys, reduce } from 'ramda'

import messagesForDomainQuery from '../queries/MessagesForDomain.graphql'

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

export const editorMessagesFromRuntime = async ({
  client,
  domain,
  runtime,
}: Props) => {
  const { components, renderMajor } = runtime
  const {
    data: { messages },
  } = await client.query<Data, Variables>({
    query: messagesForDomainQuery,
    variables: {
      components: keys(components),
      domain,
      renderMajor,
    },
  })
  return messagesToReactIntlFormat(messages)
}
