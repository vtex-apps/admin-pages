import React  from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'
import { ToastConsumer } from 'vtex.styleguide'

import RenameStyleMutation from './mutations/RenameStyle'
import UpdateStyleMutation from './mutations/UpdateStyle'

import StyleEditorHooks from './StyleEditorHooks'

interface Props {
  intl: InjectedIntl
  setStyleAsset: (asset: StyleAssetInfo) => void
  stopEditing: () => void
  style: Style
}

const StyleEditor: React.FunctionComponent<Props> = (props) => {
  return (
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
  )
}

export default injectIntl(StyleEditor)
