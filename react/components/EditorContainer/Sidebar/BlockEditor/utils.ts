import throttle from 'lodash/throttle'
import { formatIOMessage } from 'vtex.native-types'

import { getBlockPath } from '../../../../utils/blocks'
import {
  getComponentSchema,
  getExtension,
  getIframeImplementation,
  getSchemaPropsOrContentFromRuntime,
  updateExtensionFromForm,
} from '../../../../utils/components'
import { getDefaultCondition } from '../utils'

import { NEW_CONFIGURATION_ID } from './consts'
import {
  GetDefaultConfiguration,
  GetFormData,
  GetInitialEditingState,
} from './typings'

export const getDefaultConfiguration: GetDefaultConfiguration = ({
  iframeRuntime,
  isSitewide,
}) => ({
  condition: getDefaultCondition({ iframeRuntime, isSitewide }),
  contentId: NEW_CONFIGURATION_ID,
  contentJSON: '{}',
  label: null,
  origin: null,
})

export const getFormData: GetFormData = ({
  componentImplementation,
  content,
  contentSchema,
  iframeRuntime,
}) =>
  getSchemaPropsOrContentFromRuntime({
    component: componentImplementation,
    contentSchema: contentSchema,
    isContent: true,
    messages: iframeRuntime.messages,
    propsOrContent: content,
    runtime: iframeRuntime,
  }) || {}

export const getIsSitewide = (extensions: Extensions, editTreePath: string) => {
  const blockPath = getBlockPath(extensions, editTreePath)

  return (
    (blockPath.length > 0 &&
      ['AFTER', 'AROUND', 'BEFORE'].includes(blockPath[1].role)) ||
    false
  )
}

export const getInitialEditingState: GetInitialEditingState = ({
  data,
  editTreePath,
  iframeRuntime,
  intl,
  isSitewide,
}) => {
  const treePath = editTreePath || ''

  const extension = getExtension(treePath, iframeRuntime.extensions)

  const listContent = data && data.listContentWithSchema

  const componentImplementation = getIframeImplementation(extension.component)

  const contentSchema = listContent && JSON.parse(listContent.schemaJSON)

  const componentSchema = getComponentSchema({
    component: componentImplementation,
    contentSchema: contentSchema,
    isContent: true,
    propsOrContent: extension.content,
    runtime: iframeRuntime,
  })

  const title = formatIOMessage({ id: componentSchema.title || '', intl })

  const configurations = listContent && listContent.content

  // TODO: this is not always true
  const activeContent = configurations && configurations[0]

  const contentId = (activeContent && activeContent.contentId) || ''

  const content =
    (activeContent &&
      activeContent.contentJSON &&
      JSON.parse(activeContent.contentJSON)) ||
    {}

  const condition = activeContent
    ? activeContent.condition
    : getDefaultCondition({ iframeRuntime, isSitewide })

  const formData = getFormData({
    componentImplementation,
    content,
    contentSchema,
    iframeRuntime,
  })

  const label = activeContent && activeContent.label

  return {
    formState: {
      condition,
      contentId,
      content,
      formData,
      label,
    },
    partialBlockData: {
      componentImplementation,
      componentSchema,
      configurations,
      contentSchema,
      title,
    },
  }
}

export const getIsDefaultContent: (
  configuration: Pick<ExtensionConfiguration, 'origin'>
) => boolean = configuration => configuration.origin !== null

export const omitUndefined = (obj: Extension['content']) =>
  Object.entries(obj).reduce((acc, [currKey, currValue]) => {
    if (typeof currValue === 'undefined') {
      return acc
    }

    return { ...acc, [currKey]: currValue }
  }, {})

export const throttledUpdateExtensionFromForm = throttle(
  data => updateExtensionFromForm(data),
  200
)
