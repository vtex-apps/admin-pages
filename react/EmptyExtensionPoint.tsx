import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { EditorContext } from './components/EditorContext'

class EmptyExtensionPoint extends Component {
  public static schema = {
    properties: {},
    type: 'object',
  }

  public render() {
    return (
      <EditorContext.Consumer>
        {({editMode}: EditorContext) => (
          <div className={`${editMode ? 'pa7-ns pa5 mw7 center' : 'dn'}`}>
            <div className="w-100 ba b--blue br2 b--dashed pa6-ns pa6 blue tc bg-washed-blue bw1">
              <FormattedMessage id="pages.editor.empty-extension.title"/>
              <div className="fw7 pt2">
                <FormattedMessage id="pages.editor.empty-extension.edit"/>
              </div>
            </div>
          </div>
        )}
      </EditorContext.Consumer>
    )
  }
}

export default EmptyExtensionPoint
