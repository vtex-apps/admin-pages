import throttle from 'lodash/throttle'

import { updateExtensionFromForm } from '../../../../utils/components'
import { NEW_CONFIGURATION_ID } from '../consts'
import { getDefaultCondition } from '../utils'

import { GetDefaultConfiguration, GetConfigurationType } from './typings'

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

export const getConfigurationType: GetConfigurationType = ({
  configuration,
  activeContentId,
}) => {
  if (getIsDefaultContent(configuration)) {
    return 'app'
  }

  if (activeContentId === configuration.contentId) {
    return 'active'
  }

  return 'inactive'
}

export const throttledUpdateExtensionFromForm = throttle(
  data => updateExtensionFromForm(data),
  200
)
