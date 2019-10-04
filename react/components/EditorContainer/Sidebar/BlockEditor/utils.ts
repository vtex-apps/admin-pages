import throttle from 'lodash/throttle'

import {
  getSchemaPropsOrContentFromRuntime,
  updateExtensionFromForm,
} from '../../../../utils/components'
import { NEW_CONFIGURATION_ID } from '../consts'
import { isUnidentifiedPageContext } from '../utils'

import {
  GetDefaultCondition,
  GetDefaultConfiguration,
  GetFormData,
} from './typings'

export const getDefaultCondition: GetDefaultCondition = ({
  iframeRuntime,
  isSitewide,
}) => {
  const iframePageContext = iframeRuntime.route.pageContext

  const pageContext: ExtensionConfiguration['condition']['pageContext'] = isSitewide
    ? {
        id: '*',
        type: '*',
      }
    : {
        id: isUnidentifiedPageContext(iframePageContext)
          ? '*'
          : iframePageContext.id,
        type: iframePageContext.type,
      }

  return {
    allMatches: true,
    id: '',
    pageContext,
    statements: [],
  }
}

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
    contentSchema,
    isContent: true,
    messages: iframeRuntime.messages,
    propsOrContent: content,
    runtime: iframeRuntime,
  }) || {}

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
