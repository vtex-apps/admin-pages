import ListContent from '../../../graphql/ListContent.graphql'
import { ListContentData } from '../../../queries/ListContent'
import { GetDeleteStoreUpdater } from './typings'

export const isConfigurationExpired = (
  configuration: ExtensionConfiguration
) => {
  const endDateStatement = configuration.condition.statements.find(
    (statement: ExtensionConfigurationConditionStatement) =>
      statement &&
      statement.subject === 'date' &&
      JSON.parse(statement.objectJSON).to
  )

  const getEndDate = (statement: ExtensionConfigurationConditionStatement) => {
    return new Date(JSON.parse(statement.objectJSON).to)
  }

  if (endDateStatement && getEndDate(endDateStatement) < new Date()) {
    return true
  }

  return false
}

export const getConfigurationSort = (activeContentId: string) => (
  current: ExtensionConfiguration,
  previous: ExtensionConfiguration
) => {
  const isActiveConfiguration = (configuration: ExtensionConfiguration) =>
    configuration.contentId === activeContentId

  const isAppConfiguration = (configuration: ExtensionConfiguration) =>
    configuration.origin

  if (isActiveConfiguration(current)) {
    return -1
  }

  if (isAppConfiguration(current)) {
    return 1
  }

  if (isAppConfiguration(previous)) {
    return -1
  }

  if (isConfigurationExpired(previous)) {
    return -1
  }

  if (isConfigurationExpired(current)) {
    return 1
  }

  return 0
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
      bindingId: iframeRuntime.binding?.id,
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
