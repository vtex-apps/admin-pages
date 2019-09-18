import { useKeydownFromClick } from 'keydown-from-click'
import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { ToastConsumer } from 'vtex.styleguide'

import SelectionIcon from '../../../images/SelectionIcon'
import { useEditorContext } from '../../EditorContext'
import UpdateBlockMutation from '../mutations/UpdateBlock'

import ComponentList from './ComponentList'
import { getInitialComponents } from './utils'

interface Props {
  highlightHandler: (treePath: string | null) => void
  iframeRuntime: RenderContextProps['runtime']
}

const ComponentSelector: React.FunctionComponent<Props> = ({
  highlightHandler,
  iframeRuntime,
}) => {
  const [components, setComponents] = React.useState(() =>
    getInitialComponents({
      extensions: iframeRuntime.extensions,
      page: iframeRuntime.page,
    })
  )

  const editor = useEditorContext()

  const path = React.useRef('')

  React.useEffect(() => {
    if (path.current !== iframeRuntime.route.path) {
      setComponents(
        getInitialComponents({
          extensions: iframeRuntime.extensions,
          page: iframeRuntime.page,
        })
      )

      editor.setIsLoading(false)

      path.current = iframeRuntime.route.path
    }
  }, [
    editor,
    iframeRuntime.extensions,
    iframeRuntime.page,
    iframeRuntime.route.path,
  ])

  const handleEditModeToggle = editor.toggleEditMode

  const handleKeyPress = useKeydownFromClick(handleEditModeToggle)

  const handleMouseEnter = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement | HTMLLIElement>) => {
      const treePath = event.currentTarget.getAttribute('data-tree-path')

      highlightHandler(treePath)
    },
    [highlightHandler]
  )

  const handleMouseLeave = React.useCallback(() => {
    highlightHandler(null)
  }, [highlightHandler])

  return (
    <Fragment>
      <div className="flex justify-between items-center flex-shrink-0 h-3em">
        <h3 className="fw5 ph5 pv4 ma0 lh-copy f5 near-black">
          <FormattedMessage id="admin/pages.editor.components.title" />
        </h3>

        <div
          className="bg-white bn link pl3 pv3 dn flex-ns items-center justify-center self-right z-max pointer animated fadeIn outline-0"
          onClick={handleEditModeToggle}
          onKeyPress={handleKeyPress}
          role="button"
          tabIndex={0}
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
                updateSidebarComponents={setComponents}
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
