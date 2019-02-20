import React from 'react'
import { Button, IconArrowBack } from 'vtex.styleguide'

interface Props {
  backText: string
  goBack: () => void
  saveStyle: () => void
  title: string
}

const StyleEditorTools: React.SFC<Props> = ({
  backText,
  children,
  goBack,
  saveStyle,
  title,
}) => {
  return (
    <div className="h-100 flex flex-column">
      <div className="mh6 mt6">
        <div className="pointer flex items-center" onClick={goBack}>
          <IconArrowBack />
          <span className="ml4">{backText}</span>
        </div>
        <div className="flex justify-between items-center mv4">
          <span className="f3">{title}</span>
          <Button variation="tertiary" size="small" onClick={saveStyle}>
            Save
          </Button>
        </div>
      </div>
      <div className="flex flex-column flex-grow-1">{children}</div>
    </div>
  )
}

export default StyleEditorTools
