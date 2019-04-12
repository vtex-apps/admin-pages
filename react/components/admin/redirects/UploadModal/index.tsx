import classnames from 'classnames'
import React, { useState } from 'react'
import { Modal } from 'vtex.styleguide'

import Loading from './Loading'
import UploadError from './UploadError'
import UploadPrompt from './UploadPrompt'
import UploadSuccess from './UploadSuccess'

import styles from './UploadModal.css'

type States = 'PROMPT' | 'LOADING' | 'SUCCESS' | 'ERROR'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const StateSwitcher: React.FunctionComponent<{ current: States }> = ({
  current,
}) => (
  <>
    {(() => {
      switch (current) {
        case 'PROMPT':
          return <UploadPrompt />
        case 'LOADING':
          return <Loading />
        case 'SUCCESS':
          return <UploadSuccess />
        case 'ERROR':
          return <UploadError />
      }
    })()}
  </>
)

const UploadModal: React.FunctionComponent<Props> = ({ isOpen, onClose }) => {
  const [currentStep, setModalStep] = useState('PROMPT' as States)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className={classnames(
          'flex flex-column items-center justify-center',
          styles['modal-container'],
          {
            'justify-center': currentStep !== 'PROMPT',
          }
        )}
      >
        <StateSwitcher current={currentStep} />
      </div>
    </Modal>
  )
}

export default React.memo(UploadModal)
