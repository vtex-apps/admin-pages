import { JSONSchema6 } from 'json-schema'
import React from 'react'
import { Spinner, ToastConsumer } from 'vtex.styleguide'

import { getSitewideTreePath } from '../../../utils/blocks'
import { useEditorContext } from '../../EditorContext'
import DeleteContentMutation from '../mutations/DeleteContent'
import SaveContentMutation from '../mutations/SaveContent'
import ListContentQuery from '../queries/ListContent'

import ComponentEditor from './ComponentEditor'
import { useFormHandlers } from './hooks'
import { FormDataContainer } from './typings'
import { getInitialFormState, getIsSitewide } from './utils'

interface Props {
  iframeRuntime: RenderContext
}

export interface State {
  condition?: ExtensionConfiguration['condition']
  content?: Extension['content']
  contentSchema?: JSONSchema6
  formData?: Extension['content']
}

const Content = ({ iframeRuntime }: Props) => {
  const [state, setState] = React.useReducer<React.Reducer<State, State>>(
    (prevState, nextState) => ({
      ...prevState,
      ...nextState,
    }),
    {}
  )

  const { handleFormChange, handleFormClose } = useFormHandlers({
    iframeRuntime,
    setState,
    state,
  })

  const editor = useEditorContext()

  const editTreePath = editor.editTreePath || ''

  const blockId = iframeRuntime.extensions[editTreePath]
    ? iframeRuntime.extensions[editTreePath].blockId
    : ''

  const isSitewide = getIsSitewide(iframeRuntime.extensions, editTreePath)

  const template = isSitewide
    ? '*'
    : iframeRuntime.pages[iframeRuntime.page].blockId

  const serverTreePath = isSitewide
    ? getSitewideTreePath(editTreePath)
    : editTreePath

  return (
    <ToastConsumer>
      {() => (
        <ListContentQuery
          variables={{
            blockId,
            pageContext: iframeRuntime.route.pageContext,
            template,
            treePath: serverTreePath,
          }}
        >
          {({ data, loading }) => {
            if (JSON.stringify(state) === '{}') {
              if (!loading) {
                setState(
                  getInitialFormState({ data, editTreePath, iframeRuntime })
                )
              }

              return (
                <div className="mt9 flex justify-center">
                  <Spinner />
                </div>
              )
            }

            return (
              <SaveContentMutation>
                {() => (
                  <DeleteContentMutation>
                    {() => (
                      <ComponentEditor
                        condition={
                          (state
                            ? state.condition
                            : {}) as ExtensionConfiguration['condition']
                        }
                        contentSchema={state.contentSchema}
                        data={state.formData as FormDataContainer}
                        iframeRuntime={iframeRuntime}
                        isDefault
                        isNew={false}
                        isSitewide={isSitewide}
                        onChange={handleFormChange}
                        onClose={handleFormClose}
                        onConditionChange={() => {}}
                        onSave={() => {}}
                        onTitleChange={() => {}}
                        title={''}
                      />
                    )}
                  </DeleteContentMutation>
                )}
              </SaveContentMutation>
            )
          }}
        </ListContentQuery>
      )}
    </ToastConsumer>
  )
}

export default Content
