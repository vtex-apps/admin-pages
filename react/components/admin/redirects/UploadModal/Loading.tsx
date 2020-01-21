import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Progress, Spinner } from 'vtex.styleguide'

interface Props {
  current: number
  total: number
  onCancel: () => void
}

const Loading: React.FunctionComponent<Props> = ({
  current,
  onCancel,
  total,
}) => {
  const percent =
    Math.round((current * 100) / total) < 100
      ? Math.round((current * 100) / total)
      : 100

  return (
    <div className="flex flex-column items-center justify-center">
      <div className="absolute bg-white right-0 top-0 pa5 pa6-ns">
        <Spinner size={30} />
      </div>
      <div className="w-100 flex justify-between mt3 mb4">
        <span>{`${percent}%`}</span>
        <span>
          {current + ' '}/{' ' + total}
        </span>
      </div>
      <Progress type="line" percent={percent} />
      <div className="flex justify-between items-center w-100 mt8">
        <FormattedMessage
          id="admin/pages.admin.redirects.upload-modal.loading.warning"
          defaultMessage="Please don't close this window."
        />
        <Button onClick={onCancel} type="button" variation="secondary">
          <FormattedMessage
            id="admin/pages.admin.redirects.upload-modal.loading.cancel"
            defaultMessage="Cancel"
          />
        </Button>
      </div>
    </div>
  )
}

export default Loading
