import classnames from 'classnames'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Mutation } from 'react-apollo'
import { FormattedMessage, useIntl } from 'react-intl'
import { Modal } from 'vtex.styleguide'

import SaveRedirectFromFileMutation, {
  MutationRenderProps,
  UploadActionType,
} from '../mutations/SaveRedirectFromFile'
import Loading from './Loading'
import SelectAction from './SelectAction'
import UploadError from './UploadError'
import UploadPrompt from './UploadPrompt'
import {
  DeleteManyRedirectsProps,
  DeleteManyRedirectsFromFileResult,
  DeleteManyRedirectsFromFileVariables,
} from '../mutations/DeleteManyRedirectsFromFile'
import DeleteManyRedirects from '../mutations/DeleteManyRedirectsFromFile.graphql'
import { ModalStates } from './typings'
import { getAlertState } from './UploadPrompt/getAlertState'
import { AlertState } from '../typings'
import bulkUploadRedirects from '../bulkUploadRedirects'

interface Props {
  hasRedirects: boolean
  isOpen: boolean
  onClose: () => void
  onDownloadTemplate: () => void
  refetchRedirects: () => void
  setAlert: (alertState: AlertState) => void
}

const UploadModal: React.FunctionComponent<Props &
  MutationRenderProps &
  DeleteManyRedirectsProps> = ({
  deleteManyRedirects,
  error,
  hasRedirects,
  isOpen,
  onClose,
  onDownloadTemplate,
  refetchRedirects,
  saveRedirectFromFile,
  setAlert,
}) => {
  const intl = useIntl()
  const [currentStep, setModalStep] = useState<ModalStates>(
    hasRedirects ? 'SELECT_ACTION' : 'UPLOAD_FILE'
  )

  const [processedRedirect, setProcessedRedirect] = useState<number>(0)
  const [numberOfRedirects, setNumberOfRedirects] = useState<number>(-1)
  const shouldUploadRef = useRef<boolean>(false)

  useEffect(() => {
    shouldUploadRef.current = isOpen
  }, [isOpen])

  const [
    uploadActionType,
    setUploadActionType,
  ] = useState<UploadActionType | null>(hasRedirects ? null : 'save')

  const resetState = useCallback(
    async (refetch = false) => {
      onClose()
      setModalStep('SELECT_ACTION')
      setUploadActionType(hasRedirects ? null : 'save')
      setProcessedRedirect(0)
      setNumberOfRedirects(-1)
      if (refetch) {
        await refetchRedirects()
      }
    },
    [hasRedirects, onClose, refetchRedirects]
  )

  const saveRedirectFromFileCb = useCallback(
    async (parsedJsonFromCsv: Redirect[], fileName: string) => {
      shouldUploadRef.current = true
      const isSave = uploadActionType === 'save'
      const mutation = (data: Redirect[] | string[]) =>
        isSave
          ? saveRedirectFromFile({
              variables: { redirects: data as Redirect[] },
            })
          : deleteManyRedirects({
              variables: { paths: data as string[] },
            })

      try {
        const numberOfLines = parsedJsonFromCsv.length

        setNumberOfRedirects(numberOfLines)
        setModalStep('LOADING')

        const { failedRedirects } = await bulkUploadRedirects({
          data: parsedJsonFromCsv,
          isSave,
          mutation,
          shouldUploadRef,
          updateProgress: processed => {
            setProcessedRedirect(current => current + processed)
          },
        })

        if (shouldUploadRef.current) {
          setAlert(
            getAlertState({
              total: numberOfLines,
              failedRedirects,
              intl,
              fileName,
              mutation,
              isSave,
            })
          )
          resetState(true)
        }
      } catch (e) {
        setModalStep('ERROR')
      }
    },
    [
      deleteManyRedirects,
      intl,
      resetState,
      saveRedirectFromFile,
      setAlert,
      uploadActionType,
    ]
  )

  const CurrentComponent = useMemo(() => {
    switch (currentStep) {
      case 'SELECT_ACTION':
        return (
          <SelectAction
            setUploadActionType={setUploadActionType}
            uploadActionType={uploadActionType}
            setModalStep={setModalStep}
          />
        )
      case 'UPLOAD_FILE':
        return (
          uploadActionType && (
            <UploadPrompt
              hasRedirects={hasRedirects}
              onClickBack={() => setModalStep('SELECT_ACTION')}
              onDownloadTemplate={onDownloadTemplate}
              saveRedirectFromFile={saveRedirectFromFileCb}
              uploadActionType={uploadActionType}
            />
          )
        )
      case 'LOADING':
        return (
          <Loading
            current={processedRedirect}
            total={numberOfRedirects}
            onCancel={() => {
              setModalStep('UPLOAD_FILE')
              shouldUploadRef.current = false
            }}
          />
        )
      case 'ERROR':
        return <UploadError error={error} />
      default:
        return null
    }
  }, [
    currentStep,
    error,
    hasRedirects,
    numberOfRedirects,
    onDownloadTemplate,
    processedRedirect,
    saveRedirectFromFileCb,
    uploadActionType,
  ])

  return (
    <Modal centered isOpen={isOpen} onClose={resetState}>
      <h1 className="f3 fw4 mt0 mb6">
        <FormattedMessage id="admin/pages.admin.redirects.upload-modal.prompt.select-action.title" />
      </h1>
      <div
        className={classnames('flex flex-column justify-center', {
          'justify-center': currentStep !== 'UPLOAD_FILE',
        })}
      >
        {CurrentComponent}
      </div>
    </Modal>
  )
}

const UploadModalWithMutation: React.FC<Props> = props => (
  <SaveRedirectFromFileMutation>
    {(saveRedirectFromFile, mutationResult) => (
      <Mutation<
        DeleteManyRedirectsFromFileResult,
        DeleteManyRedirectsFromFileVariables
      >
        mutation={DeleteManyRedirects}
      >
        {deleteManyRedirects => (
          <UploadModal
            saveRedirectFromFile={saveRedirectFromFile}
            deleteManyRedirects={deleteManyRedirects}
            {...mutationResult}
            {...props}
          />
        )}
      </Mutation>
    )}
  </SaveRedirectFromFileMutation>
)

export default React.memo(UploadModalWithMutation)
