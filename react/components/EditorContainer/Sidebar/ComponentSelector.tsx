import React, { Fragment, PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { ToastConsumer } from 'vtex.styleguide'

import SelectionIcon from '../../../images/SelectionIcon'
import UpdateBlockMutation from '../mutations/UpdateBlock'

import { useEditorContext } from '../../EditorContext'
import ComponentList from './ComponentList'
import { SidebarComponent } from './typings'

interface Props {
  components: SidebarComponent[]
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContextProps['runtime']
  updateSidebarComponents: (components: SidebarComponent[]) => void
}

const ComponentSelector: React.FunctionComponent<Props> = ({
  components,
  highlightHandler,
  iframeRuntime,
  updateSidebarComponents,
}) => {
  const editor = useEditorContext()

  const handleMouseEnter = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement | HTMLLIElement>) => {
      const treePath = event.currentTarget.getAttribute('data-tree-path')

      highlightHandler(treePath)
    },
    []
  )

  const handleMouseLeave = React.useCallback(() => {
    highlightHandler(null)
  }, [])

  return (
    <Fragment>
      <div className="flex justify-between items-center flex-shrink-0 h-3em">
        <h3 className="fw5 ph5 pv4 ma0 lh-copy f5 near-black">
          <FormattedMessage id="admin/pages.editor.components.title" />
        </h3>
        <div
          onClick={editor.toggleEditMode}
          className="bg-white bn link pl3 pv3 dn flex-ns items-center justify-center self-right z-max pointer animated fadeIn"
        >
          <span className="pr5 b--light-gray flex items-center">
            <SelectionIcon stroke={editor.editMode ? '#368df7' : '#979899'} />
          </span>
        </div>
      </div>
      <div className="bb bw1 b--light-silver" />
      <ToastConsumer>
        {({ showToast }) => (
          <UpdateBlockMutation>
            {updateBlock => (
              <ComponentList
                components={components}
                editor={editor}
                highlightHandler={highlightHandler}
                onMouseEnterComponent={handleMouseEnter}
                onMouseLeaveComponent={handleMouseLeave}
                iframeRuntime={iframeRuntime}
                showToast={showToast}
                updateSidebarComponents={updateSidebarComponents}
                updateBlock={updateBlock}
              />
            )}
          </UpdateBlockMutation>
        )}
      </ToastConsumer>
    </Fragment>
  )
}

export default React.memo(ComponentSelector)
