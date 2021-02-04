import classnames from 'classnames'
import { zipObj } from 'ramda'
import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { defineMessages, useIntl } from 'react-intl'
import { Alert, AlertProps, Button, IconDelete, Radio } from 'vtex.styleguide'

import UploadTableIcon from '../../../../icons/UploadTable'
import { UploadActionType } from '../../mutations/SaveRedirectFromFile'
import { getCSVHeader, CSV_SEPARATOR } from '../../consts'
import { isRedirectType, validateRedirect } from './validateRedirect'
import styles from './UploadPrompt.css'

interface Props {
  hasRedirects: boolean
  onCancel: () => void
  onDownloadTemplate: () => void
  saveRedirectFromFile: (
    parsedJsonFromCsv: Redirect[],
    fileName: string,
    hasMultipleBindings: boolean
  ) => void
  setUploadActionType: React.Dispatch<React.SetStateAction<UploadActionType>>
  uploadActionType: UploadActionType
  hasMultipleBindings: boolean
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
  selectSave: {
    defaultMessage: 'Save',
    id: 'admin/pages.admin.redirects.upload-modal.prompt.select-action.save',
  },
  selectDelete: {
    defaultMessage: 'Delete',
    id: 'admin/pages.admin.redirects.upload-modal.prompt.select-action.delete',
  },
  selectUploadBody: {
    defaultMessage: 'Do you want to save or delete redirects?',
    id: 'admin/pages.admin.redirects.upload-modal.prompt.select-action.body',
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
  onCancel,
  onDownloadTemplate,
  saveRedirectFromFile,
  setUploadActionType,
  uploadActionType,
  hasMultipleBindings,
}) => {
  const intl = useIntl()
  const [file, setFile] = useState<File | null>(null)
  const [shouldShowErrors, setShouldShowError] = useState(false)
  const [parsedJsonFromCsv, setParsedJsonFromCsv] = useState<Redirect[] | null>(
    null
  )

  const [alertState, setAlert] = useState<AlertState | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[] | null>(
    null
  )

  const resetErrors = useCallback(() => {
    setShouldShowError(false)
    setValidationErrors(null)
    setAlert(null)
  }, [setShouldShowError, setValidationErrors, setAlert])

  const onDrop = useCallback(
    acceptedFiles => {
      const file = acceptedFiles[0]
      const fileExtension = file.name.substr(file.name.lastIndexOf('.') + 1)
      let nextValidationErrors: typeof validationErrors = null

      if (fileExtension !== 'csv') {
        return setAlert({
          message: intl.formatMessage(messages.unsupportedFileFormat),
        })
      }

      resetErrors()

      const reader = new FileReader()
      reader.onload = async () => {
        const redirectKeys = getCSVHeader(hasMultipleBindings).split(
          CSV_SEPARATOR
        ) as Array<keyof Redirect>
        let parsedJsonFromCsv = null
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
    [intl, resetErrors, validationErrors, hasMultipleBindings]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  })

  const handleSaveRadioChange = useCallback(() => {
    setUploadActionType('save')
  }, [setUploadActionType])

  const handleDeleteRadioChange = useCallback(() => {
    setUploadActionType('delete')
  }, [setUploadActionType])

  return (
    <>
      <p className="f4 fw3 mt0 mb5">
        {intl.formatMessage(messages.selectUploadBody)}
      </p>
      <Radio
        disabled={!hasRedirects}
        id="merge-upload-action-type"
        checked={uploadActionType === 'save'}
        label={intl.formatMessage(messages.selectSave)}
        name="upload-action-type"
        onChange={handleSaveRadioChange}
        value="save"
      />
      <Radio
        disabled={!hasRedirects}
        id="overwrite-upload-action-type"
        checked={uploadActionType === 'delete'}
        label={intl.formatMessage(messages.selectDelete)}
        name="upload-action-type"
        onChange={handleDeleteRadioChange}
        value="delete"
      />
      <p className="f5 lh-copy mv5">{intl.formatMessage(messages.body)}</p>

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
              className="input-reset pa0 bn c-action-primary pointer bg-transparent"
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

      <div className="flex mt5">
        <div className="mr-auto">
          <Button
            type="button"
            variation="tertiary"
            onClick={onDownloadTemplate}
          >
            {intl.formatMessage(messages.downloadTemplate)}
          </Button>
        </div>
        <div className="mr3">
          <Button type="button" variation="tertiary" onClick={onCancel}>
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
            saveRedirectFromFile(
              parsedJsonFromCsv,
              file.name,
              hasMultipleBindings
            )
          }
        >
          {intl.formatMessage(messages.buttonImport)}
        </Button>
      </div>
    </>
  )
}

export default React.memo(UploadPrompt)
