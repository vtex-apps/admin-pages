import React from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'
import { Spinner, ToastConsumerFunctions } from 'vtex.styleguide'

import { getSitewideTreePath } from '../../../../utils/blocks'
import { useEditorContext } from '../../../EditorContext'
import { DeleteContentMutationFn } from '../../mutations/DeleteContent'
import { SaveContentMutationFn } from '../../mutations/SaveContent'
import ListContentQuery from '../../queries/ListContent'
import { FormDataContainer } from '../typings'

import BlockConfigurationEditor from './BlockConfigurationEditor'
import BlockConfigurationList from './BlockConfigurationList'
import { useFormHandlers } from './hooks'
import { EditingState } from './typings'
import { getInitialEditingState, getIsSitewide } from './utils'

interface Props extends InjectedIntlProps {
  deleteContent: DeleteContentMutationFn
  iframeRuntime: RenderContext
  saveContent: SaveContentMutationFn
  showToast: ToastConsumerFunctions['showToast']
}

interface State extends EditingState {
  mode: 'editingActive' | 'editingInactive' | 'list'
}

const BlockEditor = ({
  deleteContent,
  iframeRuntime,
  intl,
  saveContent,
  showToast,
}: Props) => {
  const [state, setState] = React.useReducer<
    React.Reducer<State, Partial<State>>
  >(
    (prevState, nextState) => ({
      ...prevState,
      ...nextState,
    }),
    { mode: 'editingActive' }
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

  const componentTitle = React.useMemo(
    () =>
      formatIOMessage({
        id: editor.blockData.titleId || '',
        intl,
      }),
    [editor.blockData.titleId, intl]
  )

  const isSitewide = getIsSitewide(iframeRuntime.extensions, editTreePath)

  const template = isSitewide
    ? '*'
    : iframeRuntime.pages[iframeRuntime.page].blockId

  const serverTreePath = isSitewide
    ? getSitewideTreePath(editTreePath)
    : editTreePath

  const {
    handleActiveConfigurationOpen,
    handleConditionChange,
    handleFormChange,
    handleFormClose,
    handleFormSave,
    handleLabelChange,
    handleListOpen,
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

        const editorCommonProps = {
          condition: (state
            ? state.condition
            : {}) as ExtensionConfiguration['condition'],
          contentSchema: editor.blockData.contentSchema,
          data: state.formData as FormDataContainer,
          iframeRuntime: iframeRuntime,
          isSitewide: isSitewide,
          label: state.label,
          onChange: handleFormChange,
          onClose: handleFormClose,
          onConditionChange: handleConditionChange,
          onLabelChange: handleLabelChange,
          onListOpen: handleListOpen,
          onSave: handleFormSave,
          title: componentTitle,
        }

        const componentByMode = {
          editingActive: (
            <BlockConfigurationEditor isActive {...editorCommonProps} />
          ),
          editingInactive: <BlockConfigurationEditor {...editorCommonProps} />,
          list: (
            <BlockConfigurationList
              deleteContent={deleteContent}
              iframeRuntime={iframeRuntime}
              isSitewide={isSitewide}
              onBack={handleActiveConfigurationOpen}
              serverTreePath={serverTreePath}
              showToast={showToast}
              template={template}
            />
          ),
        }

        return componentByMode[state.mode]
      }}
    </ListContentQuery>
  )
}

export default injectIntl(BlockEditor)
