import React from 'react'
import { injectIntl } from 'react-intl'
import { CSSTransition } from 'react-transition-group'

import { ANIMATION_TIMEOUT } from '../../../consts'
import { useEditorContext } from '../../../EditorContext'
import DeleteContentMutation from '../../mutations/DeleteContent'
import Transitions from '../Transitions'
import { EditingState, FormDataContainer } from '../typings'
import BlockConfigurationEditor from './BlockConfigurationEditor'
import BlockConfigurationList from './BlockConfigurationList'
import { useFormHandlers } from './hooks'
import { UseFormHandlersParams } from './typings'
import { getActiveContentId } from '../../../../utils/components/index'

type Props = Omit<UseFormHandlersParams, 'setState' | 'state'> & {
  initialEditingState?: EditingState
}

export enum ConfigurationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SCHEDULED = 'SCHEDULED',
}

export interface State extends EditingState {
  mode: 'editingActive' | 'editingInactive' | 'list'
  prevMode?: State['mode']
  status?: ConfigurationStatus
}

const BlockEditor = ({
  iframeRuntime,
  initialEditingState,
  intl,
  saveContent,
  sendEventToAudit,
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

  const isFirstState = !state.prevMode

  const stateTransitions = React.useMemo(
    () => ({
      editingActiveToList:
        state.prevMode === 'editingActive' && state.mode === 'list',
      editingToList:
        state.prevMode &&
        state.prevMode.startsWith('editing') &&
        state.mode === 'list',
      listToEditingActive:
        state.prevMode === 'list' && state.mode === 'editingActive',
      listToEditing:
        state.prevMode === 'list' && state.mode.startsWith('editing'),
    }),
    [state.mode, state.prevMode]
  )

  const editor = useEditorContext()

  const activeContentId = getActiveContentId({
    extensions: iframeRuntime.extensions,
    treePath: editor.editTreePath,
  })

  const currentContent = editor.blockData?.configurations?.find(
    config => state.contentId === config.contentId
  )

  const statusFromRuntime =
    currentContent?.contentId === activeContentId
      ? ConfigurationStatus.ACTIVE
      : ConfigurationStatus.INACTIVE

  const {
    handleStatusChange,
    handleConditionChange,
    handleConfigurationCreate,
    handleConfigurationOpen,
    handleConfigurationActivate,
    handleFormBack,
    handleFormChange,
    handleFormSave,
    handleLabelChange,
    handleListClose,
    handleListOpen,
  } = useFormHandlers({
    iframeRuntime,
    intl,
    saveContent,
    sendEventToAudit,
    setState,
    showToast,
    state,
    statusFromRuntime,
  })

  return (
    <>
      <CSSTransition
        in={isFirstState || stateTransitions.listToEditing}
        mountOnEnter
        timeout={ANIMATION_TIMEOUT}
        unmountOnExit
      >
        <BlockConfigurationEditor
          state={state}
          statusFromRuntime={statusFromRuntime}
          condition={
            (state
              ? state.condition
              : {}) as ExtensionConfiguration['condition']
          }
          isNew={!currentContent}
          contentSchema={editor.blockData.contentSchema}
          editingContentId={state.contentId}
          data={state.formData as FormDataContainer}
          iframeRuntime={iframeRuntime}
          isSitewide={editor.blockData.isSitewide}
          label={state.label}
          onBack={handleFormBack}
          onChange={handleFormChange}
          onConditionChange={handleConditionChange}
          onStatusChange={handleStatusChange}
          onLabelChange={handleLabelChange}
          onListOpen={handleListOpen}
          onSave={handleFormSave}
          showToast={showToast}
          title={editor.blockData.title}
        />
      </CSSTransition>

      <Transitions.Exit condition={stateTransitions.listToEditing} to="right">
        <Transitions.Enter
          condition={stateTransitions.editingToList}
          from="right"
        >
          <DeleteContentMutation>
            {deleteContent => (
              <BlockConfigurationList
                deleteContent={deleteContent}
                onConfigurationActivate={handleConfigurationActivate}
                editingContentId={state.contentId}
                iframeRuntime={iframeRuntime}
                onConfigurationCreate={handleConfigurationCreate}
                onConfigurationOpen={handleConfigurationOpen}
                onListClose={handleListClose}
                showToast={showToast}
              />
            )}
          </DeleteContentMutation>
        </Transitions.Enter>
      </Transitions.Exit>
    </>
  )
}

export default injectIntl(BlockEditor)
