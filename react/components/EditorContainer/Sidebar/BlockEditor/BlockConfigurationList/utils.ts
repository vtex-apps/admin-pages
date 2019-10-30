import ListContent from '../../../graphql/ListContent.graphql'
import { ListContentData } from '../../../queries/ListContent'

import { GetDeleteStoreUpdater } from './typings'

export const isConfigurationExpired = (
  configuration: ExtensionConfiguration
) => {
  const parsedDate = configuration.condition.statements.reduce(
    (acc?: Date, curr?: ExtensionConfigurationConditionStatement) => {
      if (acc) {
        return acc
      }
      if (curr && curr.subject === 'date') {
        const value = JSON.parse(curr.objectJSON)
        if (value.to) {
          return new Date(value.to)
        }
      }
      return undefined
    },
    undefined
  )

  if (parsedDate && parsedDate < new Date()) {
    return true
  }

  return false
}

export const isConfigurationScheduled = (
  configuration: ExtensionConfiguration
) => configuration.condition.statements.length > 0

export const getDeleteStoreUpdater: GetDeleteStoreUpdater = ({
  action,
  blockId,
  iframeRuntime,
  serverTreePath,
  setBlockData,
  template,
}) => (store, { data }) => {
  if (action === 'reset') {
    return
  }

  const cacheAccessParameters = {
    query: ListContent,
    variables: {
      blockId,
      pageContext: iframeRuntime.route.pageContext,
      template,
      treePath: serverTreePath,
    },
  }

  const deletedContentId = data && data.deleteContent

  try {
    const queryData = store.readQuery<ListContentData>(cacheAccessParameters)

    if (queryData) {
      const content =
        queryData.listContentWithSchema &&
        queryData.listContentWithSchema.content

      const newContent =
        content &&
        content.filter(({ contentId }) => contentId !== deletedContentId)

      const newData = {
        ...queryData,
        listContentWithSchema: {
          ...queryData.listContentWithSchema,
          content: newContent,
        },
      }

      store.writeQuery({
        data: newData,
        ...cacheAccessParameters,
      })

      setBlockData({ configurations: newContent })
    }
  } catch (err) {
    console.warn('No cache found for "ListContent".')
  }
}
