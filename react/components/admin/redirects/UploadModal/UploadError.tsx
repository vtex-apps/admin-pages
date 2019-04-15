import { ApolloError } from 'apollo-client'
import React from 'react'
import { FormattedMessage } from 'react-intl'

import PaperErrorIcon from '../../../icons/PaperErrorIcon'

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
      {errors.map((errorObj, id) => {
        return (
          <React.Fragment key={`error-line-${id}`}>
            <h2>Errors on line {errorObj.lineNumber}:</h2>
            <ul>
              {errorObj.errors.map((errorMessage, messageId) => (
                <li key={`error-line-${id}-message-${messageId}`}>
                  {errorMessage}
                </li>
              ))}
            </ul>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default React.memo(UploadError)
