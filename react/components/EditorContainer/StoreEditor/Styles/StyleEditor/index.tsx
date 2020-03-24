import React from 'react'

import { createMemoryHistory } from 'history'
import { injectIntl, IntlShape } from 'react-intl'
import { Router } from 'react-router-dom'
import { ToastConsumer } from 'vtex.styleguide'

import RenameStyleMutation from './mutations/RenameStyle'
import UpdateStyleMutation from './mutations/UpdateStyle'

import StyleEditorHooks from './StyleEditorHooks'

interface Props {
  intl: IntlShape
  setStyleAsset: (asset: StyleAssetInfo) => void
  stopEditing: () => void
  style: Style
}

const StyleEditor: React.FunctionComponent<Props> = props => {
  return (
    <Router history={createMemoryHistory()}>
      <RenameStyleMutation>
        {renameStyle => (
          <UpdateStyleMutation>
            {updateStyle => (
              <ToastConsumer>
                {({ showToast }) => (
                  <StyleEditorHooks
                    {...{
                      ...props,
                      renameStyle,
                      showToast,
                      updateStyle,
                    }}
                  />
                )}
              </ToastConsumer>
            )}
          </UpdateStyleMutation>
        )}
      </RenameStyleMutation>
    </Router>
  )
}

export default injectIntl(StyleEditor)
