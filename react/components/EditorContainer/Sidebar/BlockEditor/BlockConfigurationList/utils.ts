import { NEW_CONFIGURATION_ID } from '../../consts'
import { getDefaultCondition } from '../../utils'

import { GetDefaultConfiguration } from './typings'

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
