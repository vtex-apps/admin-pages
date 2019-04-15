import classnames from 'classnames'
import React, { useCallback, useState } from 'react'
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
  isOpen: boolean
  onClose: () => void
  refetchRedirects: () => void
}

const UploadModal: React.FunctionComponent<Props & MutationRenderProps> = ({
  error,
  isOpen,
  onClose,
  refetchRedirects,
  saveRedirectFromFile,
}) => {
  const [currentStep, setModalStep] = useState('PROMPT' as States)

  const saveRedirectFromFileCb = useCallback(async ([file]) => {
    try {
      setModalStep('LOADING')
      await saveRedirectFromFile({ variables: { file } })
      setModalStep('SUCCESS')
    } catch (e) {
      setModalStep('ERROR')
    }
  }, [])

  const resetState = useCallback(
    async () => {
      setModalStep('PROMPT')
      onClose()
      if (currentStep === 'SUCCESS') {
        await refetchRedirects()
      }
    },
    [currentStep]
  )

  return (
    <Modal isOpen={isOpen} onClose={resetState}>
      <div
        className={classnames(
          'flex flex-column items-center justify-center',
          styles['modal-container'],
          {
            'justify-center': currentStep !== 'PROMPT',
          }
        )}
      >
        {(() => {
          switch (currentStep) {
            case 'PROMPT':
              return (
                <UploadPrompt saveRedirectFromFile={saveRedirectFromFileCb} />
              )
            case 'LOADING':
              return <Loading />
            case 'SUCCESS':
              return <UploadSuccess onButtonClick={resetState} />
            case 'ERROR':
              return <UploadError />
          }
        })()}
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
