import { JSONSchema6 } from 'json-schema'
import React from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { Spinner, ToastConsumerFunctions } from 'vtex.styleguide'

import { getSitewideTreePath } from '../../../utils/blocks'
import { useEditorContext } from '../../EditorContext'
import { DeleteContentMutationFn } from '../mutations/DeleteContent'
import { SaveContentMutationFn } from '../mutations/SaveContent'
import ListContentQuery from '../queries/ListContent'

import ComponentEditor from './ComponentEditor'
import { useFormHandlers } from './hooks'
import { FormDataContainer } from './typings'
import { getInitialFormState, getIsSitewide } from './utils'

interface Props extends InjectedIntlProps {
  deleteContent: DeleteContentMutationFn
  iframeRuntime: RenderContext
  saveContent: SaveContentMutationFn
  showToast: ToastConsumerFunctions['showToast']
}

export interface State
  extends Partial<Omit<ExtensionConfiguration, 'contentJSON'>> {
  componentSchema?: ComponentSchema
  content?: Extension['content']
  contentSchema?: JSONSchema6
  formData?: Extension['content']
}

const Content = ({
  // TODO
  // deleteContent,
  iframeRuntime,
  intl,
  saveContent,
  showToast,
}: Props) => {
  const [state, setState] = React.useReducer<React.Reducer<State, State>>(
    (prevState, nextState) => ({
      ...prevState,
      ...nextState,
    }),
    {}
  )

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

  const { handleFormChange, handleFormClose, handleFormSave } = useFormHandlers(
    {
      iframeRuntime,
      intl,
      saveMutation: saveContent,
      serverTreePath,
      setState,
      showToast,
      state,
      template,
    }
  )

  return (
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
              getInitialFormState({
                data,
                editTreePath,
                iframeRuntime,
              })
            )
          }

          return (
            <div className="mt9 flex justify-center">
              <Spinner />
            </div>
          )
        }

        return (
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
            onSave={handleFormSave}
            onTitleChange={() => {}}
            title={''}
          />
        )
      }}
    </ListContentQuery>
  )
}

export default injectIntl(Content)
