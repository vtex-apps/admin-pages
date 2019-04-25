import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { Button, IconArrowBack } from 'vtex.styleguide'

interface Props extends RouteComponentProps {
  auxButtonLabel?: string | React.ReactNode
  onAux?: () => void
  afterOnBack?: () => void
  title: string | React.ReactNode
}

const StyleEditorHeader: React.FunctionComponent<Props> = ({
  auxButtonLabel,
  history,
  onAux,
  afterOnBack,
  title,
}) => {
  const onBack = () => {
    history.goBack()
    if (afterOnBack) {
      afterOnBack()
    }
  }

  return (
    <div className="mh6 mt6">
      <div className="flex justify-between items-center mv4">
        <div className="flex items-center">
          <div className="pointer f3 ph4" onClick={onBack}>
            <IconArrowBack />
          </div>
          <span className="f3">{title}</span>
        </div>
        {auxButtonLabel && (
          <Button
            variation="tertiary"
            size="small"
            onClick={onAux}
            disabled={!onAux}
          >
            {auxButtonLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export default withRouter(StyleEditorHeader)
