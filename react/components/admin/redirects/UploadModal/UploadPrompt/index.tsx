import classnames from 'classnames'
import { zipObj } from 'ramda'
import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { defineMessages, useIntl } from 'react-intl'
import {
  Alert,
  AlertProps,
  Button,
  IconArrowBack,
  IconDelete,
} from 'vtex.styleguide'

import UploadTableIcon from '../../../../icons/UploadTable'
import { UploadActionType } from '../../mutations/SaveRedirectFromFile'
import { CSV_HEADER, CSV_SEPARATOR } from '../../consts'
import { isRedirectType, validateRedirect } from './validateRedirect'
import styles from './UploadPrompt.css'

interface Props {
  hasRedirects: boolean
  onClickBack: () => void
  onDownloadTemplate: () => void
  saveRedirectFromFile: (
    parsedJsonFromCsv: Redirect[],
    fileName: string
  ) => void
  uploadActionType: UploadActionType
}

const messages = defineMessages({
  alertSeeErrors: {
    defaultMessage: 'See errors',
    id:
      'admin/pages.admin.redirects.upload-modal.prompt.alert.validation-errors.action',
  },
  body: {
    defaultMessage: 'Please use our template or an exported file as base.',
    id: 'admin/pages.admin.redirects.upload-modal.prompt.body',
  },
  buttonCancel: {
    defaultMessage: 'Cancel',
    id: 'admin/pages.admin.redirects.upload-modal.prompt.button.cancel',
  },
  buttonImport: {
    defaultMessage: 'Import file',
    id: 'admin/pages.admin.redirects.upload-modal.prompt.button.import',
  },
  delete: {
    defaultMessage: 'Delete Redirects',
    id: 'admin/pages.admin.redirects.upload-modal.file.title-delete',
  },
  dropButton: {
    defaultMessage: 'choose a file',
    id: 'admin/pages.admin.redirects.upload-modal.prompt.drop.button',
  },
  dropMessage: {
    defaultMessage: 'Drop here your CSV or ',
    id: 'admin/pages.admin.redirects.upload-modal.prompt.drop.message',
  },
  downloadTemplate: {
    defaultMessage: 'Download template',
    id:
      'admin/pages.admin.redirects.upload-modal.prompt.body.download-template',
  },
  save: {
    defaultMessage: 'Save Redirects',
    id: 'admin/pages.admin.redirects.upload-modal.file.title-save',
  },
  unsupportedFileFormat: {
    defaultMessage: 'Unsupported file type. Please upload a .csv file.',
    id:
      'admin/pages.admin.redirects.upload-modal.prompt.alert.unsupported-file',
  },
  validationErrors: {
    defaultMessage: 'Validation errors on file {name}',
    id:
      'admin/pages.admin.redirects.upload-modal.prompt.alert.validation-errors',
  },
})

interface AlertState {
  message: string
  action?: AlertProps['action']
}

const UploadPrompt: React.FC<Props> = ({
  hasRedirects,
  onClickBack,
  onDownloadTemplate,
  saveRedirectFromFile,
  uploadActionType,
}) => {
  const intl = useIntl()
  const [file, setFile] = useState<File | null>(null)
  const [shouldShowErrors, setShouldShowError] = useState(false)
  const [parsedJsonFromCsv, setParsedJsonFromCsv] = useState<
    Redirect[] | undefined
  >()

  const [alertState, setAlert] = useState<AlertState | undefined>()
  const [validationErrors, setValidationErrors] = useState<
    string[] | undefined
  >()

  const resetErrors = useCallback(() => {
    setShouldShowError(false)
    setValidationErrors(undefined)
    setAlert(undefined)
  }, [setShouldShowError, setValidationErrors, setAlert])

  const onDrop = useCallback(
    acceptedFiles => {
      const file = acceptedFiles[0]
      const fileExtension = file.name.substr(file.name.lastIndexOf('.') + 1)
      let nextValidationErrors: typeof validationErrors = undefined

      if (fileExtension !== 'csv') {
        return setAlert({
          message: intl.formatMessage(messages.unsupportedFileFormat),
        })
      }

      resetErrors()

      const reader = new FileReader()
      reader.onload = async () => {
        const redirectKeys = CSV_HEADER.split(CSV_SEPARATOR) as Array<
          keyof Redirect
        >
        let parsedJsonFromCsv
        if (typeof reader.result === 'string') {
          parsedJsonFromCsv = reader.result
            .trim()
            .split('\n')
            .reduce<Redirect[]>((acc, line, lineNumber) => {
              if (lineNumber === 0) {
                return acc
              }
              const values = line.split(CSV_SEPARATOR)
              const redirect = zipObj(redirectKeys, values)
              if (isRedirectType(redirect)) {
                const validationError = validateRedirect(
                  redirect,
                  lineNumber,
                  intl
                )
                if (!validationError) {
                  acc.push({
                    ...redirect,
                    endDate: redirect.endDate || null,
                    type: redirect.type.toUpperCase() as Redirect['type'],
                  })
                } else {
                  nextValidationErrors = (nextValidationErrors || []).concat(
                    validationError
                  )
                }
              }
              return acc
            }, [])
        }

        if (nextValidationErrors && nextValidationErrors.length > 0) {
          setAlert({
            message: intl.formatMessage(messages.validationErrors, {
              name: file.name,
            }),
            action: {
              label: intl.formatMessage(messages.alertSeeErrors),
              onClick: () => setShouldShowError(value => !value),
            },
          })
          return setValidationErrors(nextValidationErrors)
        }

        setParsedJsonFromCsv(parsedJsonFromCsv)
      }
      reader.readAsText(file)
      setFile(file)
    },
    [intl, resetErrors, validationErrors]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  })

  return (
    <>
      {hasRedirects && (
        <div>
          <button
            className="input-reset bn pointer c-action-primary mr2 ph0"
            onClick={onClickBack}
          >
            <IconArrowBack />
          </button>
          {intl.formatMessage(messages[uploadActionType])}
        </div>
      )}
      <p className="f5 lh-copy mv5">{intl.formatMessage(messages.body)}</p>
      <button
        className="c-action-primary link hover-c-action-primary pointer bn pa0 f5 fw5 mb5 self-start"
        onClick={onDownloadTemplate}
      >
        {intl.formatMessage(messages.downloadTemplate)}
      </button>

      {alertState && (
        <>
          <Alert type="error" action={alertState.action}>
            {alertState.message}
          </Alert>
          {shouldShowErrors && validationErrors && validationErrors.length > 0 && (
            <ul
              className={`list pl0 b--muted-5 ba br2 f6 lh-copy overflow-y-auto pa3 ${styles['validation-errors-container']}`}
            >
              {validationErrors.map((errorMessage, id) => (
                <li key={`validation-error-${id}`}>{errorMessage}</li>
              ))}
            </ul>
          )}
        </>
      )}

      <div
        className={classnames(
          'w-100 ba br3 bw1 b--dashed flex items-center mt4',
          {
            'b--action-secondary hover-b--action-secondary bg-white justify-center': !file,
            'b--muted-3 hover-b--muted-2 bg-muted-5 justify-between ph5': !!file,
          }
        )}
      >
        {!file ? (
          <div
            {...getRootProps({
              className:
                'flex flex-column items-center justify-center w-100 pv8',
            })}
          >
            <input {...getInputProps()} />
            <div className="c-action-primary">
              <UploadTableIcon />
            </div>
            <p className="tc lh-copy mb0">
              {intl.formatMessage(messages.dropMessage)}{' '}
              <button className="input-reset bg-white bw0 fw5 pa0 hover-c-action-primary c-action-primary pointer">
                {intl.formatMessage(messages.dropButton)}
              </button>
              .
            </p>
          </div>
        ) : (
          <>
            <p className="c-on-base">{file.name}</p>
            <button
              className="input-reset pa0 bn c-action-primary pointer"
              onClick={() => {
                setFile(null)
                resetErrors()
              }}
            >
              <IconDelete />
            </button>
          </>
        )}
      </div>

      <div className="flex mt5 ml-auto">
        <div className="mr3">
          <Button type="button" variation="tertiary">
            {intl.formatMessage(messages.buttonCancel)}
          </Button>
        </div>
        <Button
          type="button"
          variation="primary"
          disabled={!parsedJsonFromCsv || validationErrors}
          onClick={() =>
            parsedJsonFromCsv &&
            file &&
            saveRedirectFromFile(parsedJsonFromCsv, file.name)
          }
        >
          {intl.formatMessage(messages.buttonImport)}
        </Button>
      </div>
    </>
  )
}

export default React.memo(UploadPrompt)
