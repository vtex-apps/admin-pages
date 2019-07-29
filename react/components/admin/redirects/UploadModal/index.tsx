import classnames from 'classnames'
import React, { useCallback, useMemo, useState } from 'react'
import { Modal } from 'vtex.styleguide'

import SaveRedirectFromFileMutation, {
  MutationRenderProps,
} from '../mutations/SaveRedirectFromFile'
import Loading from './Loading'
import UploadError from './UploadError'
import UploadPrompt from './UploadPrompt'
import UploadSuccess from './UploadSuccess'

import styles from './UploadModal.css'

type States = 'PROMPT' | 'LOADING' | 'SUCCESS' | 'ERROR'

interface Props {
  hasRedirects: boolean
  isOpen: boolean
  onClose: () => void
  refetchRedirects: () => void
}

const UploadModal: React.FunctionComponent<Props & MutationRenderProps> = ({
  error,
  hasRedirects,
  isOpen,
  onClose,
  refetchRedirects,
  saveRedirectFromFile,
}) => {
  const [currentStep, setModalStep] = useState('PROMPT' as States)

  const saveRedirectFromFileCb = useCallback(
    async ([file], uploadActionType) => {
      try {
        setModalStep('LOADING')
        await saveRedirectFromFile({ variables: { file, uploadActionType } })
        setModalStep('SUCCESS')
      } catch (e) {
        setModalStep('ERROR')
      }
    },
    [saveRedirectFromFile]
  )

  const resetState = useCallback(async () => {
    onClose()
    setModalStep('PROMPT')
    if (currentStep === 'SUCCESS') {
      await refetchRedirects()
    }
  }, [currentStep, onClose, refetchRedirects])

  const CurrentComponent = useMemo(() => {
    switch (currentStep) {
      case 'PROMPT':
        return (
          <UploadPrompt
            hasRedirects={hasRedirects}
            saveRedirectFromFile={saveRedirectFromFileCb}
          />
        )
      case 'LOADING':
        return <Loading />
      case 'SUCCESS':
        return <UploadSuccess onButtonClick={resetState} />
      case 'ERROR':
        return <UploadError error={error} />
      default:
        return null
    }
  }, [currentStep, error, hasRedirects, resetState, saveRedirectFromFileCb])

  return (
    <Modal centered isOpen={isOpen} onClose={resetState}>
      <div
        className={classnames(
          'flex flex-column items-center justify-center',
          styles['modal-container'],
          {
            'justify-center': currentStep !== 'PROMPT',
          }
        )}
      >
        {CurrentComponent}
      </div>
    </Modal>
  )
}

const UploadModalWithMutation: React.FC<Props> = props => (
  <SaveRedirectFromFileMutation>
    {(saveRedirectFromFile, mutationResult) => (
      <UploadModal
        saveRedirectFromFile={saveRedirectFromFile}
        {...mutationResult}
        {...props}
      />
    )}
  </SaveRedirectFromFileMutation>
)

export default React.memo(UploadModalWithMutation)
