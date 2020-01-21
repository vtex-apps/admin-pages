import React from 'react'
import { defineMessages, useIntl, IntlShape } from 'react-intl'
import {
  Button,
  IconDownload,
  Modal,
  ModalProps,
  ButtonWithIcon,
} from 'vtex.styleguide'
import streamSaver from 'streamsaver'
import { TextEncoder } from 'text-encoding'
import * as WebStreamsPolyfill from 'web-streams-polyfill/ponyfill'

import styles from './ImportErrorModal.css'
import { CSV_HEADER } from '../consts'
import { AlertState } from '../typings'
import bulkUploadRedirects from '../bulkUploadRedirects'

interface Props extends Omit<ModalProps, 'children'> {
  isOpen: boolean
  redirects: Redirect[]
  mutation: (data: Redirect[] | string[]) => Promise<void>
  isSave: boolean
  setAlert: (alertState: AlertState) => void
}

interface GetAlertStateArgs {
  isSave: boolean
  failedRedirects: Redirect[]
  intl: IntlShape
  mutation: (data: Redirect[] | string[]) => Promise<void>
  total: number
}

streamSaver.WritableStream = WebStreamsPolyfill.WritableStream

const messages = defineMessages({
  bulkUploadErrorButtonLabel: {
    defaultMessage: 'See errors',
    id: 'admin/pages.admin.redirects.bulk.failed.button',
  },
  buttonCancel: {
    defaultMessage: 'Cancel',
    id: 'admin/pages.admin.redirects.import-error.button.cancel',
  },
  buttonDownload: {
    defaultMessage: 'Download',
    id: 'admin/pages.admin.redirects.import-error.button.download',
  },
  buttonRetry: {
    defaultMessage: 'Retry',
    id: 'admin/pages.admin.redirects.import-error.button.retry',
  },
  retrySuccess: {
    defaultMessage: 'Retry successful.',
    id: 'admin/pages.admin.redirects.import-error.retry-success',
  },
  retryFail: {
    defaultMessage: 'Retry failed: {success} successful, {failed} failed.',
    id: 'admin/pages.admin.redirects.import-error.retry-fail',
  },
  title: {
    defaultMessage: 'Failed Redirects',
    id: 'admin/pages.admin.redirects.import-error.title',
  },
})

function getAlertState({
  isSave,
  total,
  failedRedirects,
  intl,
  mutation,
}: GetAlertStateArgs): AlertState {
  if (failedRedirects.length === 0) {
    return {
      type: 'success',
      message: intl.formatMessage(messages.retrySuccess),
    }
  }
  return {
    type: failedRedirects.length === total ? 'error' : 'warning',
    message: intl.formatMessage(messages.retryFail, {
      success: intl.formatNumber(total - failedRedirects.length),
      failed: intl.formatNumber(failedRedirects.length),
    }),
    meta: {
      failedRedirects: failedRedirects,
      mutation,
      isSave,
    },
    action: {
      label: intl.formatMessage(messages.bulkUploadErrorButtonLabel),
    },
  }
}

const ImportErrorModal: React.FC<Props> = ({
  isSave,
  redirects,
  isOpen,
  mutation,
  onClose,
  setAlert,
}) => {
  const intl = useIntl()
  const shouldUploadRef = React.useRef<boolean>(false)

  React.useEffect(() => {
    shouldUploadRef.current = isOpen
  }, [isOpen])

  const [isRetrying, setIsRetrying] = React.useState(false)

  const handleDownload = React.useCallback(() => {
    const fileStream = streamSaver.createWriteStream('failed_redirects.csv')
    const writer = fileStream.getWriter()
    const textEncoder = new TextEncoder()
    writer.write(textEncoder.encode(CSV_HEADER + '\n'))
    redirects.forEach(({ endDate, from, to, type }) => {
      writer.write(
        textEncoder.encode(`${from};${to};${type};${endDate || ''}\n`)
      )
    })
    writer.close()
  }, [redirects])

  const handleRetry = React.useCallback(async () => {
    shouldUploadRef.current = true
    try {
      const numberOfLines = redirects.length

      setIsRetrying(true)

      const { failedRedirects } = await bulkUploadRedirects({
        data: redirects,
        isSave,
        mutation,
        shouldUploadRef,
      })

      setIsRetrying(false)

      if (shouldUploadRef.current) {
        setAlert(
          getAlertState({
            total: numberOfLines,
            failedRedirects,
            intl,
            mutation,
            isSave,
          })
        )
        onClose()
      }
    } catch (e) {
      console.error(e)
    }
  }, [redirects, isSave, mutation, setAlert, intl, onClose])

  return (
    <Modal
      centered
      isOpen={isOpen}
      onClose={onClose}
      title={<h2 className="mv0">{intl.formatMessage(messages.title)}</h2>}
      bottomBar={
        <>
          <Button
            variation="secondary"
            isLoading={isRetrying}
            onClick={handleRetry}
          >
            {intl.formatMessage(messages.buttonRetry)}
          </Button>
          <span className="mr4">
            <Button
              disabled={isRetrying}
              variation="tertiary"
              onClick={onClose}
            >
              {intl.formatMessage(messages.buttonCancel)}
            </Button>
          </span>
          <span className="mr-auto">
            <ButtonWithIcon
              disabled={isRetrying}
              icon={<IconDownload />}
              variation="tertiary"
              onClick={handleDownload}
            >
              {intl.formatMessage(messages.buttonDownload)}
            </ButtonWithIcon>
          </span>
        </>
      }
    >
      <ul
        className={`list pl0 b--muted-5 ba br2 f6 lh-copy pa3 ${styles['import-error-modal-scroll']}`}
      >
        <li>{CSV_HEADER}</li>
        {redirects.map(({ endDate, from, to, type }) => (
          <li
            key={`failed-redirect-${from}`}
          >{`${from};${to};${type};${endDate || ''}`}</li>
        ))}
      </ul>
    </Modal>
  )
}

export default React.memo(ImportErrorModal)
