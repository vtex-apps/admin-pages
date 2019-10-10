import React from 'react'
import { injectIntl } from 'react-intl'

import { useEditorContext } from '../../../EditorContext'
import DeleteContentMutation from '../../mutations/DeleteContent'
import Transitions from '../Transitions'
import { EditingState, FormDataContainer } from '../typings'

import BlockConfigurationEditor from './BlockConfigurationEditor'
import BlockConfigurationList from './BlockConfigurationList'
import { useFormHandlers } from './hooks'
import { UseFormHandlersParams } from './typings'

type Props = Omit<UseFormHandlersParams, 'setState' | 'state'> & {
  initialEditingState?: EditingState
}

export interface State extends EditingState {
  mode: 'editingActive' | 'editingInactive' | 'list'
  prevMode?: State['mode']
}

const BlockEditor = ({
  iframeRuntime,
  initialEditingState,
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
      prevMode:
        nextState.mode && nextState.mode !== prevState.mode
          ? prevState.mode
          : prevState.prevMode,
    }),
    { ...initialEditingState, mode: 'editingActive' }
  )

  const stateTransitions = React.useMemo(
    () => ({
      activeToList: state.prevMode === 'editingActive' && state.mode === 'list',
      inactiveToList:
        state.prevMode === 'editingInactive' && state.mode === 'list',
      listToActive: state.prevMode === 'list' && state.mode === 'editingActive',
      listToInactive:
        state.prevMode === 'list' && state.mode === 'editingInactive',
    }),
    [state.mode, state.prevMode]
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
    handleLabelChange,
    handleListOpen,
  } = useFormHandlers({
    iframeRuntime,
    intl,
    saveContent,
    setState,
    showToast,
    state,
  })

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

  return (
    <>
      <Transitions.Exit condition={stateTransitions.activeToList} to="left">
        <Transitions.Enter
          condition={!state.prevMode || stateTransitions.listToActive}
          from="left"
        >
          {componentByMode['editingActive']}
        </Transitions.Enter>
      </Transitions.Exit>

      <Transitions.Exit condition={stateTransitions.inactiveToList} to="right">
        <Transitions.Enter
          condition={stateTransitions.listToInactive}
          from="right"
        >
          {componentByMode['editingInactive']}
        </Transitions.Enter>
      </Transitions.Exit>

      <Transitions.Exit
        condition={
          stateTransitions.listToActive || stateTransitions.listToInactive
        }
        to={stateTransitions.listToActive ? 'right' : 'left'}
      >
        <Transitions.Enter
          condition={
            stateTransitions.activeToList || stateTransitions.inactiveToList
          }
          from={stateTransitions.activeToList ? 'right' : 'left'}
        >
          {componentByMode['list']}
        </Transitions.Enter>
      </Transitions.Exit>
    </>
  )
}

export default injectIntl(BlockEditor)
