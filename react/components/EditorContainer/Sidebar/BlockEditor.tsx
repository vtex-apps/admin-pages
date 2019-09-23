import React from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { Spinner, ToastConsumerFunctions } from 'vtex.styleguide'

import { getSitewideTreePath } from '../../../utils/blocks'
import { useEditorContext } from '../../EditorContext'
import { DeleteContentMutationFn } from '../mutations/DeleteContent'
import { SaveContentMutationFn } from '../mutations/SaveContent'
import ListContentQuery from '../queries/ListContent'

import BlockConfigurationEditor from './BlockConfigurationEditor'
import { useFormHandlers } from './hooks'
import { FormDataContainer } from './typings'
import { getInitialEditingState, getIsSitewide } from './utils'
import { formatIOMessage } from 'vtex.native-types'

interface Props extends InjectedIntlProps {
  deleteContent: DeleteContentMutationFn
  iframeRuntime: RenderContext
  saveContent: SaveContentMutationFn
  showToast: ToastConsumerFunctions['showToast']
}

export interface State
  extends Partial<Omit<ExtensionConfiguration, 'contentJSON'>> {
  content?: Extension['content']
  formData?: Extension['content']
}

const BlockEditor = ({
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

  const isDataLoading = React.useMemo(
    () =>
      JSON.stringify(state) === '{}' ||
      JSON.stringify(editor.blockData) === '{}',
    [editor.blockData, state]
  )

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

  const {
    handleFormChange,
    handleFormClose,
    handleFormSave,
    handleLabelChange,
  } = useFormHandlers({
    iframeRuntime,
    intl,
    saveMutation: saveContent,
    serverTreePath,
    setState,
    showToast,
    state,
    template,
  })

  return (
    <ListContentQuery
      variables={{
        blockId,
        pageContext: iframeRuntime.route.pageContext,
        template,
        treePath: serverTreePath,
      }}
    >
      {({ data, loading: isQueryLoading }) => {
        if (isDataLoading) {
          if (!isQueryLoading) {
            const { blockData, formState } = getInitialEditingState({
              data,
              editTreePath,
              iframeRuntime,
              isSitewide,
            })

            setState(formState)

            editor.setBlockData(blockData)
          }

          return (
            <div className="mt9 flex justify-center">
              <Spinner />
            </div>
          )
        }

        const componentTitle = formatIOMessage({
          id: editor.blockData.titleId || '',
          intl,
        })

        return (
          <BlockConfigurationEditor
            condition={
              (state
                ? state.condition
                : {}) as ExtensionConfiguration['condition']
            }
            contentSchema={editor.blockData.contentSchema}
            data={state.formData as FormDataContainer}
            iframeRuntime={iframeRuntime}
            isDefault
            isSitewide={isSitewide}
            label={state.label}
            onChange={handleFormChange}
            onClose={handleFormClose}
            // TODO
            onConditionChange={() => {}}
            onLabelChange={handleLabelChange}
            onSave={handleFormSave}
            title={componentTitle}
          />
        )
      }}
    </ListContentQuery>
  )
}

export default injectIntl(BlockEditor)
