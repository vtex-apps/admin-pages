import { ApolloError } from 'apollo-client'
import React from 'react'
import { FormattedMessage } from 'react-intl'

import DangerIcon from '../../../icons/DangerIcon'
import PaperErrorIcon from '../../../icons/PaperErrorIcon'

import styles from './UploadModal.css'

interface Props {
  error?: ApolloError
}

interface ValidationLineError {
  lineNumber: number
  errors: string[]
}

const UploadError: React.FunctionComponent<Props> = ({ error }) => {
  const message = error && error.graphQLErrors[0].message
  let errors: ValidationLineError[] = []
  try {
    errors = JSON.parse(message!)
  } catch (e) {
    console.error(e)
  }
  console.log({ message })

  return (
    <div className="flex flex-column items-center justify-center">
      <PaperErrorIcon />
      <h2 className="tc fw4 mb3 mt7">
        <FormattedMessage id="pages.admin.redirects.upload-modal.fail.title" />
      </h2>
      <p className="tc c-muted-2 mt2 mb2">
        <FormattedMessage id="pages.admin.redirects.upload-modal.fail.subtitle" />
      </p>
      <p className="tc c-muted-2 mt2">
        <FormattedMessage id="pages.admin.redirects.upload-modal.fail.message" />
      </p>
      <hr
        className={`b--muted-4 br-0 bl-0 bt-0 mh0 mv0 ${
          styles['full-modal-width']
        }`}
      />
      <div
        className={`overflow-y-auto ${styles['error-container']} ${
          styles['full-modal-width']
        }`}
      >
        {errors.map((errorObj, id) => {
          return (
            <div className="flex pa3 pl7" key={`error-line-${id}`}>
              <div className="mt1">
                <DangerIcon />
              </div>
              <div className="ml4">
                <h2 className="c-danger f5 fw4 mv0">
                  <FormattedMessage id="pages.admin.redirects.upload-modal.error.line.title" />
                  {errorObj.lineNumber}:
                </h2>
                <ul className="f5 fw3 list mt2 pl0">
                  {errorObj.errors.map((errorMessage, messageId) => (
                    <li key={`error-line-${id}-message-${messageId}`}>
                      {errorMessage}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(UploadError)
