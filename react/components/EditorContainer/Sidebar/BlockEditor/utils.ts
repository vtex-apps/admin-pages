import throttle from 'lodash/throttle'

import { getBlockPath } from '../../../../utils/blocks'
import {
  getComponentSchema,
  getExtension,
  getIframeImplementation,
  getSchemaPropsOrContentFromRuntime,
  updateExtensionFromForm,
} from '../../../../utils/components'
import { getDefaultCondition } from '../utils'

import { GetInitialEditingState } from './typings'

export const getInitialEditingState: GetInitialEditingState = ({
  data,
  editTreePath,
  iframeRuntime,
  isSitewide,
}) => {
  const extension = getExtension(editTreePath, iframeRuntime.extensions)

  const listContent = data && data.listContentWithSchema

  const componentImplementation = getIframeImplementation(extension.component)

  // TODO: get contentSchema from iframeRuntime so query is not needed
  const contentSchema = listContent && JSON.parse(listContent.schemaJSON)

  const componentSchema = getComponentSchema({
    component: componentImplementation,
    contentSchema: contentSchema,
    isContent: true,
    propsOrContent: extension.content,
    runtime: iframeRuntime,
  })

  const configurations = listContent && listContent.content

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

  const formData =
    getSchemaPropsOrContentFromRuntime({
      component: componentImplementation,
      contentSchema,
      isContent: true,
      messages: iframeRuntime.messages,
      propsOrContent: content,
      runtime: iframeRuntime,
    }) || {}

  const label = activeContent && activeContent.label

  return {
    blockData: {
      componentSchema,
      configurations,
      contentSchema,
      titleId: componentSchema.title,
    },
    formState: {
      condition,
      contentId,
      content,
      formData,
      label,
    },
  }
}

export const getIsDefaultContent: (
  configuration: Pick<ExtensionConfiguration, 'origin'>
) => boolean = configuration => configuration.origin !== null

export const getIsSitewide = (extensions: Extensions, editTreePath: string) => {
  const blockPath = getBlockPath(extensions, editTreePath)

  return (
    (blockPath.length > 0 &&
      ['AFTER', 'AROUND', 'BEFORE'].includes(blockPath[1].role)) ||
    false
  )
}

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
