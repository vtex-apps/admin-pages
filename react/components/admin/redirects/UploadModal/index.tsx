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

interface RouteLocator {
  from: string
  binding: string
}
interface Props {
  hasRedirects: boolean
  isOpen: boolean
  onClose: () => void
  onDownloadTemplate: () => void
  refetchRedirects: () => void
  setAlert: (alertState: AlertState) => void
  hasMultipleBindings: boolean
}

const INITIAL_MODAL_STATE = 'UPLOAD_FILE'

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
  hasMultipleBindings,
}) => {
  const intl = useIntl()
  const [currentStep, setModalStep] = useState<ModalStates>(INITIAL_MODAL_STATE)

  const [processedRedirect, setProcessedRedirect] = useState<number>(0)
  const [numberOfRedirects, setNumberOfRedirects] = useState<number>(-1)
  const shouldUploadRef = useRef<boolean>(false)

  useEffect(() => {
    shouldUploadRef.current = isOpen
  }, [isOpen])

  const [uploadActionType, setUploadActionType] = useState<UploadActionType>(
    'save'
  )

  const resetState = useCallback(
    async (refetch = false) => {
      onClose()
      setModalStep(INITIAL_MODAL_STATE)
      setUploadActionType('save')
      setProcessedRedirect(0)
      setNumberOfRedirects(-1)
      if (refetch) {
        await refetchRedirects()
      }
    },
    [onClose, refetchRedirects]
  )

  const handlePromptCancel = useCallback(() => {
    resetState(false)
  }, [resetState])

  const saveRedirectFromFileCb = useCallback(
    async (
      parsedJsonFromCsv: Redirect[],
      fileName: string,
      hasMultipleBindings: boolean
    ) => {
      shouldUploadRef.current = true
      const isSave = uploadActionType === 'save'
      const mutation = (data: Redirect[]) => {
        if (isSave) {
          return saveRedirectFromFile({
            variables: { redirects: data as Redirect[] },
          })
        }
        const { paths, locators } = data.reduce(
          (acc, redirect) => {
            acc.paths.push(redirect.from)
            acc.locators.push({
              from: redirect.from,
              binding: redirect.binding,
            })
            return acc
          },
          {
            paths: [] as string[],
            locators: [] as RouteLocator[],
          }
        )
        const variables = hasMultipleBindings
          ? {
              paths,
              locators,
            }
          : { paths }
        return deleteManyRedirects({
          variables,
        })
      }

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
            setProcessedRedirect(processed)
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
      case 'UPLOAD_FILE':
        return (
          <UploadPrompt
            setUploadActionType={setUploadActionType}
            hasRedirects={hasRedirects}
            onCancel={handlePromptCancel}
            onDownloadTemplate={onDownloadTemplate}
            saveRedirectFromFile={saveRedirectFromFileCb}
            uploadActionType={uploadActionType}
            hasMultipleBindings={hasMultipleBindings}
          />
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
    handlePromptCancel,
    hasRedirects,
    numberOfRedirects,
    onDownloadTemplate,
    processedRedirect,
    saveRedirectFromFileCb,
    uploadActionType,
    hasMultipleBindings,
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
