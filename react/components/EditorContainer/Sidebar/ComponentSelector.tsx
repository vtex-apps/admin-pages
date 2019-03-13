import React, { Fragment, PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { ToastConsumer } from 'vtex.styleguide'

import BlocksLibraryIcon from '../../icons/BlocksLibraryIcon'

import ComponentList from './ComponentList'
import EditorHeader from './EditorHeader'
import { SidebarComponent } from './typings'

interface Props {
  components: SidebarComponent[]
  editor: EditorContext
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContextProps['runtime']
  updateSidebarComponents: (components: SidebarComponent[]) => void
}

class ComponentSelector extends PureComponent<Props> {
  public render() {
    const {
      components,
      editor,
      highlightHandler,
      iframeRuntime,
      updateSidebarComponents,
    } = this.props

    return (
      <Fragment>
        {editor.mode === 'addBlock' ? (
          <EditorHeader
            editor={editor}
            onClose={() => editor.setMode('content')}
            title={
              <FormattedMessage id="pages.editor.components.blocks-library.title">
                {text => text}
              </FormattedMessage>
            }
          />
        ) : (
          <div className="flex justify-between items-center flex-shrink-0 bb bw1 b--light-silver h-3em">
            <h3 className="ph5 f5 near-black">
              <FormattedMessage id="pages.editor.components.title" />
            </h3>
            <div
              onClick={() => {
                if (editor.editMode) {
                  editor.toggleEditMode()
                }
                editor.setMode('addBlock')
              }}
              className="bg-white bn link pl3 pv3 dn flex-ns items-center justify-center self-right z-max pointer animated fadeIn"
            >
              <span className="pr5 b--light-gray flex items-center">
                <BlocksLibraryIcon
                  color={editor.editMode ? '#368df7' : '#979899'}
                />
              </span>
            </div>
          </div>
        )}
        <ToastConsumer>
          {({ showToast }) => (
            <div className="relative">
              <ComponentList
                components={components}
                editor={editor}
                highlightHandler={highlightHandler}
                onMouseEnterComponent={this.handleMouseEnter}
                onMouseLeaveComponent={this.handleMouseLeave}
                iframeRuntime={iframeRuntime}
                showToast={showToast}
                updateSidebarComponents={updateSidebarComponents}
              />
            </div>
          )}
        </ToastConsumer>
      </Fragment>
    )
  }

  private handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement | HTMLLIElement>
  ) => {
    const treePath = event.currentTarget.getAttribute('data-tree-path')

    this.props.highlightHandler(treePath)
  }

  private handleMouseLeave = () => {
    this.props.highlightHandler(null)
  }
}

export default ComponentSelector
