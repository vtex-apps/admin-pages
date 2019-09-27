import React from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'
import { Spinner, ToastConsumerFunctions } from 'vtex.styleguide'

import { useEditorContext } from '../../../EditorContext'
import DeleteContentMutation from '../../mutations/DeleteContent'
import { SaveContentMutationFn } from '../../mutations/SaveContent'
import { ListContentQueryResult } from '../../queries/ListContent'
import { FormDataContainer } from '../typings'

import BlockConfigurationEditor from './BlockConfigurationEditor'
import BlockConfigurationList from './BlockConfigurationList'
import { useFormHandlers } from './hooks'
import { EditingState } from './typings'
import { getInitialEditingState } from './utils'

interface Props extends InjectedIntlProps {
  iframeRuntime: RenderContext
  isSitewide: boolean
  query: ListContentQueryResult
  saveContent: SaveContentMutationFn
  showToast: ToastConsumerFunctions['showToast']
}

interface State extends EditingState {
  mode: 'editingActive' | 'editingInactive' | 'list'
}

const BlockEditor = ({
  iframeRuntime,
  intl,
  isSitewide,
  query,
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

  const isDataReady = React.useMemo(
    () => state.formData && JSON.stringify(editor.blockData) !== '{}',
    [editor.blockData, state]
  )

  const {
    handleActiveConfigurationOpen,
    handleConditionChange,
    handleConfigurationCreate,
    handleFormChange,
    handleFormClose,
    handleFormSave,
    handleInactiveConfigurationOpen,
    handleLabelChange,
    handleListOpen,
  } = useFormHandlers({
    iframeRuntime,
    intl,
    query,
    saveMutation: saveContent,
    setState,
    showToast,
    state,
  })

  if (query.loading) {
    if (isDataReady) {
      setState({ formData: undefined })
    }

    return (
      <div className="mt9 flex justify-center">
        <Spinner />
      </div>
    )
  }

  if (!isDataReady) {
    const { formState, partialBlockData } = getInitialEditingState({
      data: query.data,
      editTreePath: editor.editTreePath,
      iframeRuntime,
      intl,
      isSitewide,
    })

    if (!state.formData) {
      setState(formState)
    }

    const { blockId: id, template, treePath: serverTreePath } = query.variables

    const blockData: BlockData = {
      ...partialBlockData,
      activeContentId: formState.contentId,
      id,
      serverTreePath,
      template,
    }

    if (JSON.stringify(editor.blockData) === '{}') {
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
    isSitewide: editor.blockData.isSitewide,
    label: state.label,
    onChange: handleFormChange,
    onClose: handleFormClose,
    onConditionChange: handleConditionChange,
    onLabelChange: handleLabelChange,
    onSave: handleFormSave,
    title: editor.blockData.title,
  }

  const componentByMode: Record<State['mode'], React.ReactElement> = {
    editingActive: (
      <BlockConfigurationEditor
        {...editorCommonProps}
        isActive
        onListOpen={handleListOpen}
      />
    ),
    editingInactive: <BlockConfigurationEditor {...editorCommonProps} />,
    list: (
      <DeleteContentMutation>
        {deleteContent => (
          <BlockConfigurationList
            deleteContent={deleteContent}
            iframeRuntime={iframeRuntime}
            onActiveConfigurationOpen={handleActiveConfigurationOpen}
            onBack={handleActiveConfigurationOpen}
            onConfigurationCreate={handleConfigurationCreate}
            onInactiveConfigurationOpen={handleInactiveConfigurationOpen}
            showToast={showToast}
          />
        )}
      </DeleteContentMutation>
    ),
  }

  return componentByMode[state.mode]
}

export default injectIntl(BlockEditor)
