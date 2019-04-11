import React, { useState } from 'react'
import { Modal } from 'vtex.styleguide'

import Loading from './Loading'
import UploadError from './UploadError'
import UploadPrompt from './UploadPrompt'
import UploadSuccess from './UploadSuccess'

type States = 'PROMPT' | 'LOADING' | 'SUCCESS' | 'ERROR'

interface Props {
  isOpen: boolean
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

const UploadModal: React.FunctionComponent<Props> = ({ isOpen }) => {
  const [currentStep, setModalStep] = useState('PROMPT' as States)

  return (
    <Modal isOpen={isOpen}>
      <div
        className="flex flex-column items-center justify-center"
        style={{
          minHeight: 'calc(80vh - 3rem)',
          width: '32rem',
        }}
      >
        <StateSwitcher current={currentStep} />
      </div>
    </Modal>
  )
}

export default React.memo(UploadModal)
