import React, { Fragment } from 'react'

import EditorHeader from '../../EditorHeader'

import Card from './Card'
import CreateButton from './CreateButton'

interface Props {
  activeConfiguration?: AdaptedExtensionConfiguration
  configurations: AdaptedExtensionConfiguration[]
  editor: EditorContext
  iframeWindow: Window
  isDisabledChecker: (configuration: ExtensionConfiguration) => boolean
  onClose: () => void
  onCreate: (event: Event) => void
  onSelect: (configuration: ExtensionConfiguration) => void
  title?: string
}

const List: React.SFC<Props> = ({
  configurations,
  editor,
  isDisabledChecker,
  onClose,
  onCreate,
  onSelect,
  title,
}) => (
  <Fragment>
    <EditorHeader editor={editor} onClose={onClose} title={title} />
    {configurations.map(
      (configuration: AdaptedExtensionConfiguration, index: number) => (
        <Fragment key={index}>
          <Card
            configuration={configuration}
            isDisabled={isDisabledChecker(configuration)}
            onClick={onSelect}
          />
        </Fragment>
      )
    )}
    <CreateButton onClick={onCreate} />
  </Fragment>
)

export default List
