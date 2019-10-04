import React from 'react'
import { injectIntl } from 'react-intl'
import { Spinner } from 'vtex.styleguide'

import { useEditorContext } from '../../../EditorContext'
import DeleteContentMutation from '../../mutations/DeleteContent'
import { ListContentQueryResult } from '../../queries/ListContent'
import { FormDataContainer } from '../typings'

import BlockConfigurationEditor from './BlockConfigurationEditor'
import BlockConfigurationList from './BlockConfigurationList'
import { useFormHandlers } from './hooks'
import { EditingState, UseFormHandlersParams } from './typings'

interface Props extends Omit<UseFormHandlersParams, 'setState' | 'state'> {
  isSitewide: boolean
  query: ListContentQueryResult
}

export interface State extends EditingState {
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

  const {
    handleActiveConfigurationOpen,
    handleConditionChange,
    handleConfigurationCreate,
    handleFormBack,
    handleFormChange,
    handleFormSave,
    handleInactiveConfigurationOpen,
    handleInitialStateSet,
    handleLabelChange,
    handleListOpen,
  } = useFormHandlers({
    iframeRuntime,
    intl,
    isSitewide,
    query,
    saveContent,
    setState,
    showToast,
    state,
  })

  if (query.loading || !state.formData) {
    if (!query.loading && JSON.stringify(editor.blockData) !== '{}') {
      handleInitialStateSet()
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
    onClose: handleFormBack,
    onConditionChange: handleConditionChange,
    onLabelChange: handleLabelChange,
    onSave: handleFormSave,
    showToast,
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
